const path = require('path')
const extractTags = require('./extract-tags')

/**
 * Get a suite title
 *
 * @param {*} suite
 * @param {*} options
 */
const getSuiteTitle = (suite, options) => {
  const PrefixSep = ' -- '

  const makePrefix = (suitePath, cutPrefix) => {
    const DefaultCutPrefixes = [`/features`, `/tests`, `/src/tests`]
    if (cutPrefix) {
      DefaultCutPrefixes.splice(0, 0, cutPrefix)
    }

    // Remove the current working directory from the suite path
    // and normalize the path using / as separator
    suitePath = suitePath && suitePath.replace(process.cwd(), '').split(path.sep).join('/')
    if (suitePath) {
      // remove test base dir
      DefaultCutPrefixes.forEach(cutPrefix => {
        if (suitePath.indexOf(cutPrefix) === 0) {
          suitePath = suitePath.replace(cutPrefix, '')
        }
      })

      // filter empty parts (equivalent to remove leading /)
      const suitePathParts = suitePath.split('/').filter(p => !!p)

      // remove the test filename (last path item)
      suitePath = suitePathParts.slice(0, suitePathParts.length - 1).join(PrefixSep)
    }
    return suitePath.trim()
  }

  const suitePath = suite.tests && suite.tests.length > 0 && suite.tests[0].file
  const suitePrefix = makePrefix(suitePath, options.cutPrefix)

  if (suitePrefix) {
    // extract tags from suite.title
    const {str: suiteTitleWithoutTags} = extractTags(suite.title)
    // create the suite path
    suiteTitle = [suitePrefix, suiteTitleWithoutTags].map(part => part.trim()).join(PrefixSep)
  } else {
    suiteTitle = suite.title
  }

  return suiteTitle
}

module.exports = getSuiteTitle
