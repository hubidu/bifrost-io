const assert = require('assert')
const fs = require('fs')
const path = require('path')
const DashboardClient = require('../index')
const {getErrorScreenshotFileName, mapStepToSource} = require('./utils')

let Helper = codecept_helper;

let testCtx

const CODECEPTJS_OUTPUT = './__out'
const dashboardClient = new DashboardClient()

const stringify = (o) => { 
  // Note: cache should not be re-used by repeated calls to JSON.stringify.
  var cache = [];
  const res = JSON.stringify(o, function(key, value) {
      if (typeof value === 'object' && value !== null) {
          if (cache.indexOf(value) !== -1) {
              // Circular reference found, discard key
              return;
          }
          // Store value in our collection
          cache.push(value);
      }
      return value;
  });
  cache = null; // Enable ga

  return res
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

  _after(test) {
    testCtx.commit()
    testCtx = undefined
}

  async _beforeStep(step) {
    // console.log('BEFORE STEP', step.toString())
    assert(testCtx, 'Expected a test context in order to make a screenshot')
    const browser = this._getBrowser()

    if (testCtx.isScreenshotStep(step.name)) {
      const screenshotFileName = testCtx.getFileName(step.name, step.args)
      await browser.saveScreenshot(screenshotFileName)

      testCtx.addStepScreenshot(step.name, screenshotFileName) 
    }
  }

  _afterStep(step) {
    // console.log(`AFTER STEP`, step.name)

  }

  _beforeSuite(suite) {
    console.log('BEFORE SUITE', suite.title)
  }

  _afterSuite(suite) {
    // console.log('AFTER SUITE', suite.title)
  }

  _passed(test) {
    fs.writeFileSync(test.title, stringify(test, null, 2))
    console.log(test.file)
    const stepsToSource = test.steps.map(mapStepToSource)
    // console.log(stepsToSource)
    // TODO Add device information
    // TODO Add step stacktraces

    testCtx.addSourceSnippets(stepsToSource)
    testCtx.markSuccessful()
  }

  async _failed(test) {
    console.log('FAILED', test.title)

    const stepsToSource = test.steps.map(mapStepToSource)
    // console.log(stepsToSource)

    const errorScreenshot = getErrorScreenshotFileName(test, this.options.uniqueScreenshotNames)
    fs.unlinkSync(path.join(CODECEPTJS_OUTPUT, errorScreenshot))

    // Make a new error screenshot
    const browser = this._getBrowser()
    const screenshotFileName = testCtx.getFileName('failedHere', [], '.error.png')
    await browser.saveScreenshot(screenshotFileName)
    testCtx.addStepScreenshot('error', screenshotFileName) 

    testCtx.addSourceSnippets(stepsToSource)
    testCtx.markFailed()
  }
  
  _finishTest(suite) {
    console.log('FINISHED')
  }

}

module.exports = MyHelper;