const assert = require('assert')
const debug = require('debug')('bifrost-io:codeceptjs-helper')
const path = require('path')
const chalk = require('chalk')
const info = chalk.bold.green.underline

const {getViewportSize, getUserAgent, dehighlightElement, highlightElement} = require('../src/scripts')
const getDeviceSettingsFromUA = require('../src/get-device-settings-from-ua')
const DashboardClient = require('../index')

const {stringify, getScreenshotFileName, mapStepToSource} = require('./utils')

let Helper = codecept_helper;

let suiteTitle, testCtx, commandCtx

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
    name: err.name,
    message,
    stack: err.stack,
    actual: err.actual,
    expected: err.expected,
    operator: err.operator
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

  _getSaveScreenshot() {
    const helper = this.helpers['WebDriverIO']
    if (helper) return Object.assign({}, {
      saveScreenshot: helper.browser.saveScreenshot
    })
    
    return {
      saveScreenshot: async (path) =>  this.helpers['Puppeteer'].page.screenshot({ path })
    }
  }

  _getHelper() {
    return this.helpers['WebDriverIO'] || this.helpers['Puppeteer']
  }

  _init() {}

  /**
   * Before/After Suite
   */
  _beforeSuite(suite) {
    suiteTitle = suite.title
  }

  _afterSuite(suite) {
    suiteTitle = undefined
  }

  /**
   * Before/After Test
   */
  async _before() {
    try {
      testCtx = dashboardClient.createTestContext(suiteTitle, 'before', true)
    } catch (err) {
      console.log('ERROR in _before hook', err)
    }
  }

  _test(test) {
    // Skip if test context already exists (created by before)
    if (testCtx) {
      testCtx.updateTitles(test.parent.title, test.title)      
      return
    }

    // TODO I think there is no chance anymore to actually get here
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
      // TODO Create test context on first step
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
    // Skip when no test context
    if (!testCtx) {
      return
    }
    if (!commandCtx) {
      throw new Error('WARN Expected a command context in order to make a screenshot')
    }
    const s = this._getSaveScreenshot()
    const helper = this._getHelper()

    // Highlight element
    const sel = commandCtx.getSelector()
    if (commandCtx.shouldHighlight()) {
      try {
        debug(`${step.name} ${step.humanizeArgs()}: Highlighting element ${sel}`)
        if (sel) {
          await helper.executeScript(highlightElement, sel, false, `I ${step.name} ${step.humanizeArgs()}`)  
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
        await s.saveScreenshot(screenshotFileName)
  
        commandCtx.addScreenshot(screenshotFileName) 
      }

      // Convert stack to source snippets and add to command context
      commandCtx.addSourceSnippets(mapStepToSource(step))

      // Add url and title
      const [url, title, _] = await Promise.all([ helper.grabCurrentUrl(), helper.grabTitle(), helper.executeScript(dehighlightElement)])
      commandCtx.addPageInfo({
        url,
        title
      })
    }
  }

  async _passed(test) {
    if (!testCtx) {
      return
    }
   
    const helper = this._getHelper()

    // Add device info
    const [userAgent, viewportSize] = await Promise.all([helper.executeScript(getUserAgent), helper.executeScript(getViewportSize)])
    const deviceSettings = getDeviceSettingsFromUA(userAgent, viewportSize)
    testCtx.addDeviceSettings(deviceSettings)

    testCtx.markSuccessful()
  }

  async _failed(test) { 
    const isBeforeHook = t => t.ctx && t.ctx._runnable && t.ctx._runnable.title.indexOf('before') >= 0

    try {
      if (!testCtx) {
        // console.log('WARN Expected a test context in order to make a screenshot')
        return
      }
      if (!commandCtx) {
        console.log('WARNING Expected to have a command context')
        return
      }

      const codeceptjsErrorScreenshot = getCodeceptjsScreenshotPath(test, this.options.uniqueScreenshotNames)

      /**
       * In case the test fails in a before hook
       * we have to tweak the test object
       */
      if (isBeforeHook(test)) {
        testCtx.updateTitles(test.title, test.ctx.currentTest.title)
        const failedHook = test.ctx._runnable
        failedHook.err = test.err
        test = failedHook
      }

      assert(test.err, 'Exepcted test to have an err property')
      assert(test.steps, 'Expected test to have a steps property')
      // const browser = this._getBrowser()
      const s = this._getSaveScreenshot()
      const helper = this._getHelper()
    
      // Need to add url and title for the failed command
      const [url, title] = await Promise.all([ helper.grabCurrentUrl(), helper.grabTitle()])
      commandCtx.addPageInfo({
        url,
        title
      })
  
      try {
        commandCtx.addExistingScreenshot(codeceptjsErrorScreenshot, toError(test.err))   
      } catch (err) {
        debug(`WARNING Failed to add codeceptjs error screenshot ${codeceptjsErrorScreenshot} to command context`, 
          JSON.stringify(err, null, 2))
        console.log(`WARNING Could not add existing error screenshot ${codeceptjsErrorScreenshot}`)
        // NOTE This can happen since codeceptjs may fail to produce an error screenshot
        //   (e. g. in the case with large data tables)

        // So let's just take our own screenshot
        const screenshotFileName = commandCtx.getFileName()
        await s.saveScreenshot(screenshotFileName)
  
        commandCtx.addScreenshot(screenshotFileName, toError(test.err))         
      }
  
      const [userAgent, viewportSize] = await Promise.all([helper.executeScript(getUserAgent), helper.executeScript(getViewportSize)])
      const deviceSettings = getDeviceSettingsFromUA(userAgent, viewportSize)
      testCtx.addDeviceSettings(deviceSettings)
  
      if (test.steps.length > 0) {
        // Generally I expect tests to fail on steps
        const failedStep = test.steps[0]
        testCtx.commands[testCtx.commands.length - 1].addSourceSnippets(mapStepToSource(failedStep))  
      } else {
        // However they could also fail at other places, e. g. on an assert statement in the test
        // In this case we just report the error
      }
  
      testCtx.markFailed(toError(test.err))  
    } catch (err) {
      console.log('ERROR in _failed(test) hook: ', err)
    }
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