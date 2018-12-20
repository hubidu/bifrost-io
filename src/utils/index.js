const extractTags = require('./extract-tags')
const zipDirectory = require('./zip-directory')
const extractBaseUrl = require('./extract-base-url')
const makeUrlsAbsolute = require('./make-urls-absolute')
const gitLastCommit = require('./git-last-commit')
const shouldTakeScreenshot = require('./should-take-screenshot')
const getDeviceSettingsFromUA = require('./get-device-settings-from-ua')
const getDeviceSettingsFromSession = require('./get-device-settings-from-session')
const normalizePath = require('./normalize-path')
const extractStepOutline = require('./extract-step-outline')
const findTestSourceInSource = require('./find-test-source-in-source')
const getSuiteTitle = require('./get-suite-title')

module.exports = {
    getSuiteTitle,
    extractTags,
    zipDirectory,
    extractBaseUrl,
    makeUrlsAbsolute,
    gitLastCommit,
    shouldTakeScreenshot,
    getDeviceSettingsFromUA,
    getDeviceSettingsFromSession,
    normalizePath,
    extractStepOutline,
    findTestSourceInSource,
}
