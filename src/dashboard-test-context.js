const debug = require('debug')('bifrost-io:dashboard-test-context')
const fs = require('fs')
const path = require('path')
const assert = require('assert')
const uuidv1 = require('uuid/v1')
const mkdirp = require('mkdirp')
const codeExcerpt = require('code-excerpt')

const config = require('./config')
const {zipDirectory, extractTags} = require('./utils')
const generateReport = require('./generate-report')
const {sendReport, isDashboardHostConfigured} = require('./dashboard-api')

const OUTPUT_BASE = './__out'

const REPORT_FILENAME = 'report.json'
const SOURCE_FILENAME = 'source.txt'
const BROWSERLOGS_FILENAME = 'browserlogs.json'

const toString = val => {
    if (val === undefined || val === null) return val
    return val.toString()
}
const makeFileName = str => str.replace(/[^0-9a-zA-Z\- \.\(\),]/g, '')
const fileToString = fileName => fs.readFileSync(fileName).toString()
const stringToFile = (filename, str) => fs.writeFileSync(filename, str)
const toSeconds = num => num / 1000;
const writeReport = (testContext) => fs.writeFileSync(testContext.getReportFileName(), JSON.stringify(generateReport(testContext), null, 2))
const rmFileSync = filename => fs.unlinkSync(filename) 
const cleanTitle = str => str.replace(/\r?\n|\r/, ' ').replace(/\s+/g,' ').trim()
const getErrorMessage = err => err.inspect ? err.inspect() : err.message;

/**
 * Collect data for a single test command
 */
class DashboardCommandContext {
    constructor(testContext, stepName, stepArgs) {
        this.testContext = testContext
        this.stepNo =  testContext.getStepNumber()
        this.name = stepName
        this.args = stepArgs
        this.pageInfo = undefined
        this.screenshot = undefined
        this.codeStack = []
    }    

    _createScreenshot(screenshotFileName, err = undefined) {
        this.screenshot = {
            shotAt: Date.now(),
            success: err !== undefined ? false : true,
            message: err ? getErrorMessage(err) : undefined,
            orgStack: err ? err.stack : undefined,
            actual: err ? toString(err.actual) : undefined,
            expected: err ? toString(err.expected) : undefined,
            screenshot: screenshotFileName || 'not_available',
        }
    }

    /**
     * Retrieve the selector from command arguments
     */
    getSelector() {
        if (this.name.indexOf('click') === 0) {
            if (this.args.length === 1) {
                return this.args[0]
            } else if (this.args.length === 2) {
                return this.args[1]
            }
        } else if (this.name.indexOf('fillField') === 0) {
            return this.args[0]
        } else if (this.name === 'seeNumberOfVisibleElements' || this.name === 'seeElementInDOM' || this.name === 'seeInField') {
            return this.args[0]
        } else if (this.name.indexOf('see') === 0) {
            if (this.args.length === 1) {
                return this.args[0]
            } else if (this.args.length === 2) {
                return this.args[1]
            }
        } else {
            // TODO Should be configurable with autoscreenshotPrefixes (see shouldTakeScreenshot)
            // TODO Implement a better selector detection
            return undefined
        }
    }

    /**
     * Decide before which commands a screenshot should be taken
     */
    shouldTakeScreenshot() {
        const isCustomPrefix = (prefixes = []) => prefixes.find(prefix => this.name.indexOf(prefix) >= 0);
        
        const res = this.name.indexOf('click') >= 0 || 
            this.name.indexOf('amOnPage') >= 0 || 
            this.name.indexOf('see') >= 0 || 
            this.name.indexOf('say') >= 0 || 
            // this.name.indexOf('selectOption') >= 0 || 
            isCustomPrefix(config.autoscreenshotMethodPrefixes) !== undefined;
      
        if (res) debug(`Should take screenshot for ${this.name} = ${res}`)
        
        return res
    }

    /**
     * Decide on which commands to do element highlighting on the web page
     */
    shouldHighlight() {
        return this.name.indexOf('click') >= 0 || 
            this.name.indexOf('see') >= 0
    }

    /**
     * Associate a screenshot file with the current step
     */
    addScreenshot(screenshotFileName, err = undefined) {
        const moveToTestDirSync = (filename) => {
            const targetFile = path.join(this.testContext.outputPath, filename)
            fs.renameSync(path.join('.', filename), targetFile)    
            return targetFile            
        }

        const targetFile = moveToTestDirSync(screenshotFileName)

        this._createScreenshot(screenshotFileName, err)

        debug(`Added ${err ? 'error' : 'success'} screenshot ${screenshotFileName}`)
        return this
    }

    addExistingScreenshot(screenshotPath, err = undefined) {
        const targetFileName = this.getFileName()
        fs.renameSync(screenshotPath, path.join(this.testContext.outputPath, targetFileName))    

        this._createScreenshot(targetFileName, err)

        debug(`Added existing ${err ? 'error' : 'success'} screenshot ${screenshotPath}`)
        return this
    }

    /**
     * Associate a source code snippet with the command
     */
    addSourceSnippets(sourceSnippets) {
        this.codeStack = sourceSnippets.map(({sourceLine, sourceFile}) => {
            return {
                location: {
                    line: sourceLine,
                    file: sourceFile
                },
                source: codeExcerpt(fileToString(sourceFile), sourceLine),
            }
        }).reverse() // code snippet of the command should be first in list
    }

    addPageInfo(pageInfo) {
        this.pageInfo = pageInfo
        return this
    }    

    markFailed(err) {
        if (!err) throw new Error('Expected to get an error instance')
        if (!this.screenshot) {
            console.log(`WARNING Expected to have a screenshot record by now. Will create one now...`)
            this._createScreenshot(undefined, err)
        }

        debug(`${this.name}: Command failed ${err.message}`)
    }

    /**
     * Create a filename (e. g. to save a screenshot) for the current step
     */
    getFileName(ext = '.png') {
        const stepName = `${this.name}(${this.args.join(',')})`.slice(0, 20) // limit to max chars
        return makeFileName(`${this.stepNo} - I.${stepName}.png`)
    }
    
}

class DashboardTestContext {
    constructor(runid, suiteTitle, testTitle) {
        assert(runid, 'Expected an runid (id which identifies this test run)')
        this.OWNER_KEY = config.ownerkey
        assert(this.OWNER_KEY, 'Expected an access OWNER_KEY for the dashboard service (process.env.OWNER_KEY)')
        this.TEST_PROJECT = config.project
        assert(this.TEST_PROJECT, 'Expected a project name/identifier for this e2e project (process.env.TEST_PROJECT)')

        const res1 = extractTags(suiteTitle)
        suiteTitle = res1.str
        const res2 = extractTags(testTitle)
        testTitle = cleanTitle(res2.str)
        
        this.TEST_BASE = `${makeFileName(suiteTitle)} -- ${makeFileName(testTitle)}`
        this.TEST_DIR = `${Date.now()}`
        this.outputPath = path.join(OUTPUT_BASE, this.TEST_BASE, this.TEST_DIR)
        mkdirp.sync(this.outputPath)
      
        this.tags = res1.tags.concat(res2.tags)
        this.runid = runid
        this.result = undefined
        this.reportFileName = REPORT_FILENAME // just the filename of the report data file
        this.reportDir = [this.OWNER_KEY, this.TEST_PROJECT, this.TEST_BASE, this.TEST_DIR].join('/')
        this.startedAt = Date.now()
        this.duration = undefined // in seconds
        this.prefix = `${suiteTitle}`
        this.title = testTitle
        this.fullTitle = `${this.TEST_PROJECT} -- ${this.prefix} -- ${testTitle}`

        this.commands = []
        this.deviceSettings = undefined
        this.stepCounter = 1

        this.logs = []
        this.outline = []
    }

    updateTitles(suiteTitle, testTitle) {
        const res1 = extractTags(suiteTitle)
        suiteTitle = res1.str
        const res2 = extractTags(testTitle)
        testTitle = cleanTitle(res2.str)
        
        this.prefix = `${this.TEST_PROJECT} -- ${suiteTitle}`
        this.title = testTitle
        this.fullTitle = `${this.prefix} -- ${testTitle}`
    }

    createCommandContext(stepName, stepArgs) {
        const cmd = new DashboardCommandContext(this, stepName, stepArgs.map(arg => arg.toString()))
        this.commands.push(cmd)
        return cmd
    }

    getStepNumber() {
        return this.stepCounter++
    }

    /**
     * Add device settings. name and type are required.
     */
    addDeviceSettings(deviceSettings) {
        assert(deviceSettings.name)
        assert(deviceSettings.type)
        this.deviceSettings = deviceSettings
    }

    /**
     * Add a file with the test's source code to the report data
     */
    addSource(source = 'No test source found') {
        const sourceFile = this.getSourceFileName()
        stringToFile(sourceFile, source)
    }

    /**
     * Add a file containing the browser logs
     */
    addBrowserLogs(logs = []) {
        const browserLogsFileName = this.getBrowserLogsFileName()
        stringToFile(browserLogsFileName, JSON.stringify(logs, null, 2))
    }

    /**
     * Call it when the test succeeded
     */
    markSuccessful() {
        this.result = 'success'
        this.duration = toSeconds(Date.now() - this.startedAt)

        debug(`${this.title}: Test successful`)        
    }

    /**
     * Call it with an error instance when the test failed
     */
    markFailed(err) {
        this.result = 'error'
        this.duration = toSeconds(Date.now() - this.startedAt)

        // Update the last command (i. e. the error step) with the error
        assert(this.commands.length > 0, 'Expected commands to not be empty')
        const failedCommand = this.commands[this.commands.length - 1]
        failedCommand.markFailed(err)        

        debug(`${this.title}: Test failed ${err.message}`)        
    }

    /**
     * Generate a report file name
     */
    getReportFileName(ext = '.json') {
        return path.join(this.outputPath, REPORT_FILENAME)
    }

    getSourceFileName(ext = '.txt') {
        return path.join(this.outputPath, SOURCE_FILENAME)
    }

    getBrowserLogsFileName(ext = '.txt') {
        return path.join(this.outputPath, BROWSERLOGS_FILENAME)
    }

    /**
     * Send the report and data to the dashboard service
     */
    async commit() {       
        debug(`${this.title}: Committing test results`)
        writeReport(this);

        if (isDashboardHostConfigured()) {
            const zipFile = await zipDirectory(this.outputPath, this.reportDir);
            try {
                await sendReport(zipFile)
            } finally {
                rmFileSync(zipFile)   
            }
        }
    }
}

module.exports = DashboardTestContext