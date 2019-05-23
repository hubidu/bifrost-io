# Backlog

- IDEA Just rerun failed tests (get from heimdall backend)
- IDEA When an error occurs extract more detailed context info from the page
- Always take fullscreen screenshots
- Take html snapshots on first run or first run after failed
- FIX report git changes for test file (not whole repo)
- BUG codeceptjs: Converts { xpath: '' } selector into a string (in step args) -> file a bug
- Make highlighting for xpath selectors work
- PRB When a test throws an assertion, the error does not have a stack property (which would be nice to mark the actual source location of the failure)
- IDEA Link to stories in test titles using tags: Provide issue tracker url and tag regex template
- IDEA Improve errors (try to find out what exactly went wrong): 
    * Does not make sense to trigger a retry if an assertion failed (like wrong text in input field) while it does make sense if an element could not be found
- Performance logs: Must take performance logs for each new page
- Performance: Try out setting performance markers
- BUG Highlighting xpath expressions with puppeteer does not work
- XPATH Should also detect .// as xpath (imporove css/xpath detection)
- Make this codeceptjs error nicer:
    'expected element .ResultTariffListItem-tariffName to include "B1"'

    Expected  'B1'
    Found  '120
    ___(next element)___
    SecurAL BV 10 AU
    ___(next element)___
    S-M.A.R.T
    ___(next element)___
    Getsurance Job mit Option Psyche
    ___(next element)___
    XL
    ___(next element)___
    --( 69 lines more )---'
- Add a proper cahngelog for the project
- Unfortunately say will not be reported as a step: Add say to autoscreenshot methods
- Use regexes for proper css detection
- HOw can I add the result of a rest api call?
- Better parser for codeceptjs assertion errors
- HIde sensitive data in test source, steps and step.args
- BETTER DO IN REPORT Add more error details (actual/expected)
- BETTER DO IN REPORT Improve error messages
- Enable logging json or markdown to provide additional information (e. g. links to items)
- Autowait for elements
- Support for custom auto screenshot methods
- BUG: Stacktraces extraction does not work in 
  http://localhost:4000/details?ownerkey=WubaDm0VZj&project=%23All& hashcategory=1722448850
- BUG That should work:
	WARNING Could not find test in stack [ '    at Object.navigateToLandingPage (/tests/src/page-objects/pages/landing.page.js:21:7)',
  17-Sep-2018 13:41:11	  '    at Test.Data.only.Scenario (/tests/src/tests/default-segment/landing-pages.test.js:15:17)' ]
- Android: Extract more info for deviceSettings from native and webview sessions
- seeInField: should highlight field (even when command failed)
- Highlight element by text (e. g. in I.click('button text'))
- Better error message: I.click(text, context): Should show me clickable elements with similar text

# Doing

- DONE Should not generate multiple runids when running in parallel
- DONE BUG Data Driven Tests: Tag extraction also detects email address in data driven test as tag
    -> Cut out data driven part first, then extract tags
 
## Done
- DONE Bug: xpaths selectors are not highlighted
- DONE saveScreenshot should copy the screenshot not move
- DONE Reverse screenshot order (actually report app should order by time)
- DONE report-app: Filter by token and project
- DONE Add project id
- DONE Specify token for report data upload
- DONE Show a url to the dashboard after test execution
- DONE Speed up test import
- DONE Extract User Agent info
- DONE Implement element highlighting
- DONE Filter commands without screenshot?
- DONE Add a runId
- DONE Reset highlight element on each step
- DONE Fix: invalid element state: Failed to execute 'querySelectorAll' on 'Document': '//li[text()="Wichtigste Leistungen"]' is not a valid selector.
- DONE Fix TypeError: Cannot read property 'addExistingScreenshot' of undefined
- DONE Fix: Why do I see waitFor... as screenshot commands?
- DONE Add formatted step.name and args to report app (and report model)
- DONE Externalize config
- DONE Include page object source snippet
- DONE CHECK Fix: Incorrect source line location in stack trace
- DONE There are still cases where stack traces seem weird (e. g. When I am not a civil servant Then I dont see special details @tariffDetails)
- DONE Implement support for xpath selectors
- DONE Add correct stack trace for this.clickLink()
- DONE Parse standard assertion errors
- DONE Make server report processing more robust
- DONE Retry holiday test
- DONE Incorporate screenshots generated with codeceptjs into report
- DONE Test with real project
- DONE Add environment info
- DONE Extract tags from test title
- DONE Support puppeteer in codeceptjs helper
- DONE No stacktrace when within session (probably same for within)
- DONE Supply test source code to dashboard server
- DONE Add browser console logs
- DONE Dont include project in title
- DONE Report also git user and git revision
- DONE Autoscreenshots on grab... ?
- DONE puppeteer: Use this for perf logs:
    const performance = JSON.parse(await page.evaluate(
      () => JSON.stringify(window.performance)
    ));
- DONE On Error also create an html snapshot
- Html snapshot: Make all relative image and css links absolute
- Elements are not highlighted on failed steps
- Add some performance logs
- BUG git changes are obviously fro bifrost not from the test project
- Research failing tests in puppeteer together with bifrost helper: e2e-insurance-login-app-tests, branch is feature/VETHVPM-2668-rethink-test-approach
- Research "MaxListenersExceededWarning: Possible EventEmitter memory leak ": Create a contract me, partner, 4 other persons with additional occupation
- Take screenshots in beforeStep()
- Send bifrost version with report data
- Take screenshot in afterStep for I.amOnPage
- Test fullpage screenshots
- Check: RUnning tests in mobile emulation mode
- Dont add project name to prefix
- Extract steps from test source and report
- Format prefix correctly (no unncecessary blanks)
- Find and report starting line number of test in test source file
- grabTextFrom is not highlighting selector
- Already implemented: seeNumberOf.../seeElement has selector as first parameter
- Cannot do: Autoscreenshots: I.see* : Would be better to take the screenshot AFTER the method call
- Cannot reproduce: Bug "When the test fails in a before() hook": No test source => _failed(test) hook:  { AssertionError [ERR_ASSERTION]: Expected the complete source
    at module.exports (/home/stefan/Projects/bifrost-io/examples/codeceptjs/node_modules/bifrost-io/src/utils/find-test-source-in-source.js:20:3)
- Fix git log spam




