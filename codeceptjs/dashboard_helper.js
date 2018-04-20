const assert = require('assert')
const fs = require('fs')
const path = require('path')

const DashboardClient = require('../index')

const {writeStringToFileSync, stringify, getErrorScreenshotFileName, mapStepToSource} = require('./utils')

let Helper = codecept_helper;

let testCtx, commandCtx

const CODECEPTJS_OUTPUT = './__out'
const dashboardClient = new DashboardClient()

const rmCodeceptjsErrorScreenshotSync = (test, useUniqueScreenshotNames) => {
  const errorScreenshot = getErrorScreenshotFileName(test, useUniqueScreenshotNames)
  fs.unlinkSync(path.join(CODECEPTJS_OUTPUT, errorScreenshot))
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
  _before(test) {
      // console.log('BEFORE TEST')
  }

  _test(test) {
    console.log('TEST', test.title)
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
    // console.log('BEFORE STEP', step.toString())
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
    // TODO Make a new error screenshot
    const browser = this._getBrowser()
    // const screenshotFileName = testCtx.getFileName('failedHere', [], '.error.png')
    // await browser.saveScreenshot(screenshotFileName)
    // testCtx.addStepScreenshot('error', screenshotFileName) 

    commandCtx = undefined
  }

  _beforeSuite(suite) {}

  _afterSuite(suite) {}

  _passed(test) {
    const stepsToSource = test.steps.map(mapStepToSource).reverse()
    testCtx.commands.forEach((cmd,i ) => {
      cmd.addSourceSnippet(stepsToSource[i].sourceFile, stepsToSource[i].sourceLine)
    })

    testCtx.markSuccessful()
  }

  async _failed(test) {  
    const browser = this._getBrowser()

    rmCodeceptjsErrorScreenshotSync(test, this.options.uniqueScreenshotNames)

    testCtx.addDeviceSettings({
      name: 'desktop',
      browser: browser.desiredCapabilities.browserName,
      // orientation: await browser.getOrientation(), // only on mobile
      type: 'desktop',
      width: await  browser.getViewportSize('width'),
      height: await  browser.getViewportSize('height')
    })

    const stepsToSource = test.steps.map(mapStepToSource).reverse()
    testCtx.commands.forEach((cmd,i ) => {
      cmd.addSourceSnippet(stepsToSource[i].sourceFile, stepsToSource[i].sourceLine)
    })

    testCtx.markFailed(toError(test.err))
  }
  
  _finishTest(suite) {
    // All tests are finished
  }

}

module.exports = MyHelper;