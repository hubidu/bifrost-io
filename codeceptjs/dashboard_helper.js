const assert = require('assert')
const fs = require('fs')
const path = require('path')

const DashboardClient = require('../index')

const {writeStringToFileSync, stringify, getErrorScreenshotFileName, mapStepToSource} = require('./utils')

let Helper = codecept_helper;

let testCtx, commandCtx

// TODO Obtain configured codeceptjs output dir
const CODECEPTJS_OUTPUT = './__out'
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
    stack: err.stack
  }
}

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
  _before(test) {}

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
    assert(testCtx, 'Expected a test context in order to make a screenshot')
    const browser = this._getBrowser()

    commandCtx = testCtx.createCommandContext(step.name, step.args)

    if (commandCtx.shouldTakeScreenshot()) {
      const screenshotFileName = commandCtx.getFileName()
      await browser.saveScreenshot(screenshotFileName)

      commandCtx.addScreenshot(screenshotFileName) 
    }

    commandCtx.addPageInfo({
      url: await browser.getUrl(),
      title: await browser.getTitle()
    })
  }

  _afterStep(step) {
    const browser = this._getBrowser()

    // commandCtx = undefined
  }

  _beforeSuite(suite) {}

  _afterSuite(suite) {}

  async _passed(test) {
    const browser = this._getBrowser()

    const stepsToSource = test.steps.map(mapStepToSource)
    testCtx.commands.forEach((cmd,i ) => {
      cmd.addSourceSnippet(stepsToSource[i].sourceFile, stepsToSource[i].sourceLine)
    })

    testCtx.addDeviceSettings({
      name: 'desktop',
      browser: browser.desiredCapabilities.browserName,
      // orientation: await browser.getOrientation(), // only on mobile
      type: 'desktop',
      width: await  browser.getViewportSize('width'),
      height: await  browser.getViewportSize('height')
    })

    testCtx.markSuccessful()
  }

  async _failed(test) {  
    const browser = this._getBrowser()

    const codeceptjsErrorScreenshot = getCodeceptjsErrorScreenshotPath(test, this.options.uniqueScreenshotNames)

    commandCtx.addExistingScreenshot(codeceptjsErrorScreenshot, toError(test.err)) 

    testCtx.addDeviceSettings({
      name: 'desktop',
      browser: browser.desiredCapabilities.browserName,
      // orientation: await browser.getOrientation(), // only on mobile
      type: 'desktop',
      width: await  browser.getViewportSize('width'),
      height: await  browser.getViewportSize('height')
    })

    const stepsToSource = test.steps.map(mapStepToSource).reverse() // IMPORTANT codeceptjs reverses the steps if the test case fails (last step is now the first in list)
    testCtx.commands.forEach((cmd,i ) => {
      cmd.addSourceSnippet(stepsToSource[i].sourceFile, stepsToSource[i].sourceLine)
    })

    testCtx.markFailed(toError(test.err))
  }
  
  async _finishTest(suite) {
    const url = await dashboardClient.getDashboardUrl()
    if (url) {
      console.log('************************************************')
      console.log('* You can view the report in the dashboard now *')
      console.log(`*    ${url}`)
      console.log('************************************************')  
    }
  }

}

module.exports = MyHelper;