const assert = require('assert')

const isAt = (haystack, needle, index) => {
  for (l of needle) {
    console.log('')
    console.log('needle line', l)
    console.log('haystack line', haystack[index])
    console.log('=', l == haystack[index])

    if (haystack[index++] !== l) return false
  }
  return true
}

const trimLine = l => l.trim().replace(/;$/, '')

/**
 * Find the given test source snippet in the complete source file
 * and return the line number
 *
 * @param {*} completeSource
 * @param {*} testSource
 */
module.exports = (completeSource, testSource) => {
  assert(completeSource, 'Expected the complete source')
  assert(testSource, 'Expected the test source')

  const completeSourceLinesTrimmed =
    completeSource
      .split('\n')
      .map(trimLine)

  const testSourceLinesTrimmed = testSource.split('\n').map(trimLine)

  for (let i = 0; i < (completeSourceLinesTrimmed.length - testSourceLinesTrimmed.length) + 1; i++) {
    if (isAt(completeSourceLinesTrimmed, testSourceLinesTrimmed, i)) {
      return i + 1 // want to return the line number
    }
  }
  return -1
}
