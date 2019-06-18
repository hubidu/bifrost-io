const assert = require('assert')
const debug = require('debug')('bifrost-io:codeceptjs-helper')
const path = require('path')
const chalk = require('chalk')
const info = chalk.bold.green.underline

const DashboardClient = require('../index')
const {
  getViewportSize,
  getUserAgent,
  dehighlightElement,
  // getPerformance,
  highlightElement} = require('../src/scripts')
// TODO Refactor Move all this to utils
const {
  stringify,
  fileToStringSync,
  getTestFilePathFromStack,
  getScreenshotFileName,
  mapStepToSource} = require('./utils')
const {
  getSuiteTitle,
  extractBaseUrl,
  getDeviceSettingsFromSession,
  getDeviceSettingsFromUA
} = require('../src/utils')

// TODO Should support unique screenshot filenames
const getScreenshotPath = filename => path.join(global.output_dir, filename);
const getCodeceptjsScreenshotPath = (test, useUniqueScreenshotNames, isError = true) => {
  const errorScreenshot = getScreenshotFileName(test, useUniqueScreenshotNames, isError)
  return path.join(global.output_dir, errorScreenshot)
}
const toString = sth => {
  if (typeof sth === 'string') return sth
  if (typeof sth === 'object') return JSON.stringify(sth)
  return '' + sth
}
const toError = err => {
  let message = err.message;
  if (err.inspect) { // AssertionFailedError
    message = err.message = err.inspect();
  }

  return {
    name: err.name,
    message: toString(message),
    stack: err.stack,
    actual: err.actual,
    expected: err.expected,
    operator: err.operator
  }
}
const printToConsole = msg => console.log(info(msg))
const isScreenshotStep = step => step.name === 'saveScreenshot'
const ignoreError = promise =>  promise.catch(e => undefined)

/**
 * Some global variables
 */
let Helper = codecept_helper;

let suiteTitle, testCtx, commandCtx, currentUrl
// let testPerformanceLogs = []

const dashboardClient = new DashboardClient()

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

  assertThat(expr, msg) {
    if (!expr) {
      return Promise.reject(msg)
    }
    return Promise.resolve()
  }

  _getSaveScreenshot() {
    let helper = this.helpers['WebDriver'] || this.helpers['WebDriverIO']
    if (helper) return Object.assign({}, {
      saveScreenshot: async filename => await helper.browser.saveScreenshot(filename)
    })

    helper = this.helpers['Puppeteer']
    if (helper) {
      return {
        saveScreenshot: async (path) =>  this.helpers['Puppeteer'].page.screenshot({ path })
      }
    }

    helper = this.helpers['Appium']
    if (helper) {
      return Object.assign({}, {
        saveScreenshot: async filename => await helper.browser.saveScreenshot(filename)
      })
    }
  }

  _getHelper() {
    let webdriverHelper = this.helpers['WebDriver'] || this.helpers['WebDriverIO']
    if (webdriverHelper) {
      return Object.assign(webdriverHelper, {
        grabSession: async () => undefined,
        grabPerformanceLogs: async () => {
          try {
            const logs = await webdriverHelper.browser.log('performance')
            return logs.value.map(l => JSON.parse(l.message))
            } catch (err) {
              // console.log('WARNING', err)
              debug('INFO No performance logs found')
          }
        }
      })
    }

    const puppeteerHelper = this.helpers['Puppeteer']
    if (puppeteerHelper) {
      return Object.assign(puppeteerHelper, {
        grabSession: async () => undefined,
        grabPerformanceLogs: async () => Promise.resolve([]),
      })
    }

    const appiumHelper = this.helpers['Appium']
    return Object.assign(appiumHelper, {
      grabSession: async () => (await appiumHelper.browser.session()).value,
      grabTitle: async () => '-',
      grabCurrentUrl: async () => appiumHelper.grabCurrentActivity(),
      executeScript: async () => Promise.resolve(),
      grabPerformanceLogs: async () => Promise.resolve([])
    })
  }

  _init() {}

  /**
   * Before/After Suite
   */
  _beforeSuite(suite) {
    suiteTitle = getSuiteTitle(suite, this.options)
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
      // testPerformanceLogs = []
      currentUrl = undefined
    } catch (err) {
      console.log('ERROR in _before hook', err)
    }
  }

  _test(test) {
    // Skip if test context already exists (created by before)
    if (testCtx) {
      // testCtx.updateTitles(test.parent.title, test.title)
      testCtx.updateTitles(suiteTitle, test.title)
      return
    }

    // TODO I think there is no chance anymore to actually get here
    try {
      testCtx = dashboardClient.createTestContext(suiteTitle, test.title)
    } catch (err) {
      console.log('ERROR in _test hook', err)
    }
  }

  async _after() {
    if (!testCtx) {
      // if this happens we just continue
      return
    }

    testCtx.commit()
    testCtx = undefined
}

  async _beforeStep(step) {
    if (!testCtx) {
      // if this happens we just continue
      return
    }

    try {

      const s = this._getSaveScreenshot()
      const helper = this._getHelper()

      /* NOTE Command context must be created here, since afterStep might be skipped
      * in case the test fails
      */
      commandCtx = testCtx.createCommandContext(step.name, step.args)

      if (commandCtx.shouldHighlight()) {
        let sel = commandCtx.getSelector()

        try {
          debug(`${step.name} ${step.humanizeArgs()}: Highlighting element ${sel}`)
          if (sel) {
            await helper.executeScript(highlightElement, sel, false, `I ${step.name} ${step.humanizeArgs()}`)
          } else {
            if (process.env.DEBUG) {
              console.log(`WARNING Selector ${sel} is falsy for ${step.name} ${step.args}`)
            }
          }
        } catch (err) {
          if (process.env.DEBUG) {
            console.log(`WARNING Failed to highlight I ${step.name} ${step.args}`, typeof(sel))
          }
        }
      }

      if (commandCtx.shouldTakeScreenshot('before')) {
        const screenshotFileName = commandCtx.getFileName()
        debug(`${step.name} ${step.humanizeArgs()}: Taking screenshot to ${screenshotFileName}`)

        await s.saveScreenshot(screenshotFileName, true)

        commandCtx.addScreenshot(screenshotFileName)

        // Convert stack to source snippets and add to command context
        commandCtx.addSourceSnippets(mapStepToSource(step))

        // Add url and title
        debug(`${step.name}: Getting page url and title after step`)
        const [url, title, _] = await Promise.all([helper.grabCurrentUrl(), helper.grabTitle(), helper.executeScript(dehighlightElement)])
        commandCtx.addPageInfo({
          url,
          title
        })

        // Add to current test performance logs
        // TODO Move that to test context
        if (url !== currentUrl) {
          // debug(`${step.name} ${step.humanizeArgs()}: Getting performance logs ${currentUrl} -> ${url}`)
          // const performanceLogs = await helper.executeScript(getPerformance)
          // if (performanceLogs) {
          //   testPerformanceLogs = testPerformanceLogs.concat(JSON.parse(performanceLogs))
          // }
          // console.log(step.name, currentUrl, url, testPerformanceLogs.length)
          currentUrl = url
        }
      }

    } catch (err) {
      console.log(`ERROR Unexpected error in beforeStep():`, err)
    }
  }

  /**
   * NOTE _afterStep() will be skipped when the step fails
   */
  async _afterStep(step) {
    // Skip when no test context
    if (!testCtx) {
      return
    }

    const s = this._getSaveScreenshot()

    try {

      if (isScreenshotStep(step) || commandCtx.shouldTakeScreenshot('after')) {
        const afterCommandCtx = testCtx.createCommandContext(step.name + '.after', step.args)

        if (isScreenshotStep(step)) { // NOTE MUST be in after Step
          // Move screenshot made in test to report
          const codeceptjsScreenshot = getScreenshotPath(step.args[0])
          try {
            afterCommandCtx.addExistingScreenshot(codeceptjsScreenshot)
          } catch (err) {
            console.log(`WARNING Failed to add codeceptjs error screenshot ${codeceptjsScreenshot} to command context`, err)
          }
        } else {
          // Take screenshot
          const screenshotFileName = afterCommandCtx.getFileName()
          debug(`${step.name} ${step.humanizeArgs()}: Taking screenshot (after step) to ${screenshotFileName}`)

          await s.saveScreenshot(screenshotFileName, true)

          afterCommandCtx.addScreenshot(screenshotFileName)
        }
        // Convert stack to source snippets and add to command context
        afterCommandCtx.addSourceSnippets(mapStepToSource(step))

        afterCommandCtx.addPageInfo({
          title: step.name === 'amOnPage' ? step.args[0] : 'unknown', // NOTE be careful to get url and page title on puppeteer (Navigation Context destroyed exception)
          url: step.name === 'amOnPage' ? step.args[0] : 'unknown'
        })
      }

    } catch (err) {
      console.log(`ERROR Unexpected error in afterStep():`, err)
    }
  }

  async _passed(test) {
    try {
      if (!testCtx) {
        return
      }

      const helper = this._getHelper()

      // Get various data from the browser
      const [
        userAgent,
        viewportSize,
        browserLogs,
        performanceLogs,
        session,
      ] = await Promise.all([
        helper.executeScript(getUserAgent),
        helper.executeScript(getViewportSize),
        helper.grabBrowserLogs(),
        helper.grabPerformanceLogs(),
        helper.grabSession()
      ].map(ignoreError))

      const deviceSettings = session ? getDeviceSettingsFromSession(session) : getDeviceSettingsFromUA(userAgent, viewportSize)
      testCtx.addDeviceSettings(deviceSettings)

      // Add source (make sure we have steps, TODO actually that should be always the case here)
      let sourceCode
      if (test.steps.length > 0) {
        const testFilePath = getTestFilePathFromStack(test.steps[0].stack)
        sourceCode = fileToStringSync(testFilePath)
        testCtx.addSource(sourceCode)
      }

      testCtx.addBrowserLogs(browserLogs)
      testCtx.addPerformanceLogs(performanceLogs)

      testCtx.extractAndAddStepOutlineFromSource(sourceCode, test.body)

      testCtx.markSuccessful()
    } catch (err) {
      console.log('ERROR in _passed hook: ', err)
    }
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
        // testCtx.updateTitles(test.title, test.ctx.currentTest.title)
        testCtx.updateTitles(suiteTitle, test.ctx.currentTest.title)
        const failedHook = test.ctx._runnable
        failedHook.err = test.err
        test = failedHook
      }

      assert(test.err, 'Exepcted test to have an err property')
      assert(test.steps, 'Expected test to have a steps property')
      // const browser = this._getBrowser()
      const s = this._getSaveScreenshot()
      const helper = this._getHelper()

      debug(`Test FAILED with ${test.err.message}`)

      try {
        commandCtx.addExistingScreenshot(codeceptjsErrorScreenshot, toError(test.err))
      } catch (err) {
        debug(`WARNING Failed to add codeceptjs error screenshot ${codeceptjsErrorScreenshot} to command context`,
          JSON.stringify(err, null, 2))

        if (!process.env.NODE_ENV) {
          console.log(`WARNING Could not add existing error screenshot ${codeceptjsErrorScreenshot}`)
        }
        // NOTE This can happen since codeceptjs may fail to produce an error screenshot
        //   (e. g. in the case with large data tables)

        // So let's just take our own screenshot
        const screenshotFileName = commandCtx.getFileName()
        await s.saveScreenshot(screenshotFileName)

        commandCtx.addScreenshot(screenshotFileName, toError(test.err))
      }

      debug('Getting data from page (source, url, title, browserlogs ...)')
      const [pageSource, url, title, userAgent, viewportSize, browserLogs, performanceLogs, session] = await Promise.all([
        helper.grabSource(),
        helper.grabCurrentUrl(),
        helper.grabTitle(),
        helper.executeScript(getUserAgent),
        helper.executeScript(getViewportSize),
        helper.grabBrowserLogs(),
        helper.grabPerformanceLogs(),
        // helper.executeScript(getPerformance),
        helper.grabSession()
      ].map(ignoreError))

      // Add url and page title
      commandCtx.addPageInfo({
        url,
        title
      })

      // Add device settings
      const deviceSettings = session ? getDeviceSettingsFromSession(session) : getDeviceSettingsFromUA(userAgent, viewportSize)
      testCtx.addDeviceSettings(deviceSettings)

      if (test.steps.length > 0) {
        // Generally I expect tests to fail on steps
        // so I report the step
        const failedStep = test.steps[0]
        testCtx.commands[testCtx.commands.length - 1].addSourceSnippets(mapStepToSource(failedStep))
      } else {
        // However they could also fail at other places, e. g. on an assert statement in the test
        // In this case we just report the error

        // NOTE Problem is that in this case the error does not have a proper stacktrace
      }

      // Add the source file (extracted from the step stack)
      let testFile = test.file
      let sourceCode
      if (!testFile && test.steps && test.steps.length > 0) { // if no file prop extract from stack
        testFile = getTestFilePathFromStack(test.steps[0].stack)
      }
      if (testFile) {
        sourceCode = fileToStringSync(testFile)
        testCtx.addSource(sourceCode)
      }

      // Add the browserlogs
      testCtx.addBrowserLogs(browserLogs)
      testCtx.addPerformanceLogs(performanceLogs)

      // Add html of page
      testCtx.addPageHtml(pageSource, extractBaseUrl(url))

      testCtx.extractAndAddStepOutlineFromSource(sourceCode, test.body)

      // Mark the test as failed
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
