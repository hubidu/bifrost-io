const assert = require('assert')
const debug = require('debug')('bifrost-io:codeceptjs-helper')
const fs = require('fs')
const path = require('path')
const chalk = require('chalk')
const info = chalk.bold.green.underline

const {getUserAgent, dehighlightElement, highlightElement} = require('../scripts')
const getDeviceSettingsFromUA = require('../get-device-settings-from-ua')
const DashboardClient = require('../index')

const {writeStringToFileSync, stringify, getScreenshotFileName, mapStepToSource} = require('./utils')

let Helper = codecept_helper;

let testCtx, commandCtx

const dashboardClient = new DashboardClient()

// TODO Should support unique screenshot filenames
const getScreenshotPath = filename => path.join(global.output_dir, filename);
const getCodeceptjsScreenshotPath = (test, useUniqueScreenshotNames, isError = true) => {
  const errorScreenshot = getScreenshotFileName(test, useUniqueScreenshotNames, isError)
  return path.join(global.output_dir, errorScreenshot)
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
const isScreenshotStep = step => step.name === 'saveScreenshot'

class BifrostIOHelper extends Helper {
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
    if (!testCtx) {
      // console.log('WARN Expected a test context in order to commit the report data')
      return
    }
    testCtx.commit()
    testCtx = undefined
}

  async _beforeStep(step) {
    if (!testCtx) {
      // console.log('WARN Expected a test context in order to make a screenshot')
      return
    }

    /* NOTE Command context must be created here, since afterStep might be skipped
     * in case the test fails
     */
    commandCtx = testCtx.createCommandContext(step.name, step.args)
  }

  /**
   * NOTE _afterStep() will be skipped when the step fails
   */
  async _afterStep(step) {
    if (!testCtx) {
      // console.log('WARN Expected a test context in order to make a screenshot')
      return
    }
    if (!commandCtx) {
      throw new Error('WARN Expected a command context in order to make a screenshot')
    }
    const browser = this._getBrowser()

    // Highlight element
    const sel = commandCtx.getSelector()
    if (commandCtx.shouldHighlight()) {
      try {
        debug(`${step.name} ${step.humanizeArgs()}: Highlighting element ${sel}`)
        if (sel) {
          await browser.execute(highlightElement, sel, false, `I ${step.name} ${step.humanizeArgs()}`)  
        }
      } catch (err) {
        console.log(`WARNING Failed to highlight element ${sel}`, err)
      }  
    }

    if (isScreenshotStep(step) || commandCtx.shouldTakeScreenshot()) {
      if (isScreenshotStep(step)) {
        const codeceptjsScreenshot = getScreenshotPath(step.args[0])
        try {
          commandCtx.addExistingScreenshot(codeceptjsScreenshot)   
        } catch (err) {
          console.log(`WARNING Failed to add codeceptjs error screenshot ${codeceptjsScreenshot} to command context`, err)
        }          
      } else {
        const screenshotFileName = commandCtx.getFileName()
        await browser.saveScreenshot(screenshotFileName)
  
        commandCtx.addScreenshot(screenshotFileName) 
      }

      // Convert stack to source snippets and add to command context
      commandCtx.addSourceSnippets(mapStepToSource(step))

      // Add url and title
      const [url, title, _] = await Promise.all([ browser.getUrl(), browser.getTitle(), browser.execute(dehighlightElement)])
      commandCtx.addPageInfo({
        url,
        title
      })
    }
  }

  _beforeSuite(suite) {}

  _afterSuite(suite) {}

  async _passed(test) {
    if (!testCtx) {
      // console.log('WARN Expected a test context in order to make a screenshot')
      return
    }

    const browser = this._getBrowser()

    // Add device info
    const [{value: userAgent}, viewportSize] = await Promise.all([browser.execute(getUserAgent), browser.getViewportSize()])
    const deviceSettings = getDeviceSettingsFromUA(userAgent, viewportSize)
    testCtx.addDeviceSettings(deviceSettings)

    testCtx.markSuccessful()
  }

  async _failed(test) {  
    if (!testCtx) {
      // console.log('WARN Expected a test context in order to make a screenshot')
      return
    }
    if (!commandCtx) {
      console.log('WARNING Expected to have a command context')
      return
    }

    const browser = this._getBrowser()

    // Need to add url and title for the failed command
    const [url, title] = await Promise.all([ browser.getUrl(), browser.getTitle()])
    commandCtx.addPageInfo({
      url,
      title
    })

    const codeceptjsErrorScreenshot = getCodeceptjsScreenshotPath(test, this.options.uniqueScreenshotNames)
    try {
      commandCtx.addExistingScreenshot(codeceptjsErrorScreenshot, toError(test.err))   
    } catch (err) {
      console.log(`WARNING Failed to add codeceptjs error screenshot ${codeceptjsErrorScreenshot} to command context`, err)
    }

    const [{value: userAgent}, viewportSize] = await Promise.all([browser.execute(getUserAgent), browser.getViewportSize()])
    const deviceSettings = getDeviceSettingsFromUA(userAgent, viewportSize)
    testCtx.addDeviceSettings(deviceSettings)

    assert(test.steps.length > 0)
    const failedStep = test.steps[0]
    testCtx.commands[testCtx.commands.length - 1].addSourceSnippets(mapStepToSource(failedStep))

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

module.exports = BifrostIOHelper;