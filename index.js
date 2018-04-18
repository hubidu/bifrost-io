const path = require('path')
const assert = require('assert')
const fs = require('fs')
const uuidv1 = require('uuid/v1')
const mkdirp = require('mkdirp')
const codeExcerpt = require('code-excerpt')

const OUTPUT_BASE = './__out'

const makeFileName = str => str.replace(/[^0-9a-zA-Z\- \.\(\)]/g, '')
const fileToString = fileName => fs.readFileSync(fileName).toString()

class DashboardTestContext {
    constructor(suiteTitle, testTitle) {
        this.outputPath = path.join(OUTPUT_BASE, `${suiteTitle} -- ${testTitle}`, `${Date.now()}`)
        mkdirp.sync(this.outputPath)

        this.screenshots = {}
        this.counter = 1
    }

    addSourceSnippets(stepToSource) {
        const sourceSnippets = stepToSource.map(ss => codeExcerpt(fileToString(ss.sourceFile), ss.sourceLine))
        console.log(sourceSnippets)
    }

    isScreenshotStep(stepName) {
        return ['click', 'fillField', 'amOnPage'].indexOf(stepName)
    }

    addStepScreenshot(stepName, screenshotFileName) {
        const targetFile = path.join(this.outputPath, screenshotFileName)
        fs.renameSync(path.join('.', screenshotFileName), targetFile)

        this.screenshots[stepName] = targetFile
        return this
    }

    getFileName(stepName, stepArgs, ext = '.png') {
        return makeFileName(`${this.counter++}-I.${stepName}(${stepArgs.join(',')}).png`)
    }

    commit() {
        console.log('TODO commit test data')
        /**
         * TODO Move the report files to the dashboard service
         */        
    }

    markSuccessful() {
        console.log('TODO mark test as successful')
    }

    markFailed() {
        console.log('TODO mark test as failed')
    }
}

class DashboardClient {
    constructor() {
        this.screenshots = []
    }

    createTestContext(suiteTitle, testTitle) {
        const ctx = new DashboardTestContext(suiteTitle, testTitle)
        return ctx
    }

    destroyTestContext() {
    }

}

module.exports = DashboardClient