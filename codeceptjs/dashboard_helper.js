const assert = require('assert')
const fs = require('fs')
const path = require('path')
const chalk = require('chalk')
const info = chalk.bold.green.underline

const {getUserAgent, dehighlightElement, highlightElement} = require('../scripts')
const getDeviceSettingsFromUA = require('../get-device-settings-from-ua')
const DashboardClient = require('../index')

const {writeStringToFileSync, stringify, getErrorScreenshotFileName, mapStepToSource} = require('./utils')

let Helper = codecept_helper;

let testCtx, commandCtx

const CODECEPTJS_OUTPUT = global.output_dir
const dashboardClient = new DashboardClient()

const getCodeceptjsErrorScreenshotPath = (test, useUniqueScreenshotNames, targetFileName) => {
  const errorScreenshot = getErrorScreenshotFileName(test, useUniqueScreenshotNames)
  return path.join(CODECEPTJS_OUTPUT, errorScreenshot)
}

const toError = err => {
  let message = err.message;
  if (err.inspect) { // AssertionFailedError
    message = err.message = err.inspect();
  }
  return {
    message,
    stack: err.stack,
    actual: err.actual,
    expected: err.expected
  }
}

const printToConsole = msg => console.log(info(msg))

class MyHelper extends Helper {
  constructor(config) {
    super(config)
    // set defaults
    this.options = {
      uniqueScreenshotNames: false,
      disableScreenshots: false,
    }
    Object.assign(this.options, config);
  }

  _getBrowser() {
    return this.helpers['WebDriverIO'].browser
  }

  _init() {}

  // before/after hooks
  _before() {
  }

  _test(test) {
    try {
      testCtx = dashboardClient.createTestContext(test.parent.title, test.title)
    } catch (err) {
      console.log('ERROR in _test hook', err)
    }
  }

  async _after(test) {
    testCtx.commit()
    testCtx = undefined
}

  async _beforeStep(step) {
    // console.log(step.name, step.args.join(','))
  }

  async _afterStep(step) {
    if (!testCtx) {
      console.log('WARN Expected a test context in order to make a screenshot')
      return
    }
    const browser = this._getBrowser()

    commandCtx = testCtx.createCommandContext(step.name, step.args)

    // Highlight element
    const sel = commandCtx.getSelector()
    if (sel) await browser.execute(highlightElement, sel, false, `I ${step.name} ${step.humanizeArgs()}`)

    if (commandCtx.shouldTakeScreenshot()) {
      const screenshotFileName = commandCtx.getFileName()
      await browser.saveScreenshot(screenshotFileName)

      commandCtx.addScreenshot(screenshotFileName) 
    }

    if (sel) await browser.execute(dehighlightElement)

    commandCtx.addPageInfo({
      url: await browser.getUrl(),
      title: await browser.getTitle()
    })
  }

  _beforeSuite(suite) {}

  _afterSuite(suite) {}

  async _passed(test) {
    if (!testCtx) {
      console.log('WARN Expected a test context in order to make a screenshot')
      return
    }

    const browser = this._getBrowser()

    const stepsToSource = test.steps.map(mapStepToSource)
    testCtx.commands.forEach((cmd,i ) => {
      cmd.addSourceSnippet(stepsToSource[i].sourceFile, stepsToSource[i].sourceLine)
    })

    const {value: userAgent} = await browser.execute(getUserAgent)
    const viewportSize = await browser.getViewportSize()
    const deviceSettings = getDeviceSettingsFromUA(userAgent, viewportSize)
    testCtx.addDeviceSettings(deviceSettings)

    testCtx.markSuccessful()
  }

  async _failed(test) {  
    if (!testCtx) {
      console.log('WARN Expected a test context in order to make a screenshot')
      return
    }

    const browser = this._getBrowser()

    const codeceptjsErrorScreenshot = getCodeceptjsErrorScreenshotPath(test, this.options.uniqueScreenshotNames)

    commandCtx.addExistingScreenshot(codeceptjsErrorScreenshot, toError(test.err)) 

    const {value: userAgent} = await browser.execute(getUserAgent)
    const viewportSize = await browser.getViewportSize()
    const deviceSettings = getDeviceSettingsFromUA(userAgent, viewportSize)
    testCtx.addDeviceSettings(deviceSettings)

    const stepsToSource = test.steps.map(mapStepToSource).reverse() // IMPORTANT codeceptjs reverses the steps if the test case fails (last step is now the first in list)
    testCtx.commands.forEach((cmd,i ) => {
      cmd.addSourceSnippet(stepsToSource[i].sourceFile, stepsToSource[i].sourceLine)
    })

    testCtx.markFailed(toError(test.err))
  }
  
  async _finishTest(suite) {
    const url = await dashboardClient.getDashboardUrl()
    if (url) {
      console.log('')
      console.log('')
      console.log(`Go here to see reports:`)
      printToConsole(`  ${url}`)
      console.log('')
    }
  }

}

module.exports = MyHelper;