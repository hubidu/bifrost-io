const extractTags = require('./extract-tags')
const zipDirectory = require('./zip-directory')
const extractBaseUrl = require('./extract-base-url')
const makeUrlsAbsolute = require('./make-urls-absolute')
const gitLastCommit = require('./git-last-commit')
const shouldTakeScreenshot = require('./should-take-screenshot')

module.exports = {
    extractTags,
    zipDirectory,
    extractBaseUrl,
    makeUrlsAbsolute,
    gitLastCommit,
    shouldTakeScreenshot,
}