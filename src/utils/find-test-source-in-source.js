const assert = require('assert')

const isAt = (haystack, needle, index) => {
  for (l of needle) {
    if (haystack[index++] !== l) return false
  }
  return true
}

module.exports = (completeSource, testSource) => {
  assert(completeSource, 'Expected the complete source')
  assert(testSource, 'Expected the test source')

  const completeSourceLines = completeSource.split('\n').map(l => l.trim())
  const testSourceLinesTrimmed = testSource.split('\n').map(l => l.trim())
  // const testSourceLinesTrimmed = testSourceLines.slice(1, testSourceLines.length - 2)

  // console.log(completeSourceLines, testSourceLinesTrimmed)

  for (let i = 0; i < (completeSourceLines.length - testSourceLinesTrimmed.length) + 1; i++) {
    if (isAt(completeSourceLines, testSourceLinesTrimmed, i)) {
      return i + 1
    }
  }
  return -1
}
