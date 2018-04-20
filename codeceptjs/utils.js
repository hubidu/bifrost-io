const fs = require('fs')

/**
 * Determine the filename of codeceptjs error
 */
const getErrorScreenshotFileName = (test, uniqueScreenshotNames) => {
    const clearString = function (str) {
      /* Replace forbidden symbols in string
       */
      return str
        .replace(/ /g, '_')
        .replace(/"/g, "'")
        .replace(/\//g, '_')
        .replace(/</g, '(')
        .replace(/>/g, ')')
        .replace(/:/g, '_')
        .replace(/\\/g, '_')
        .replace(/\|/g, '_')
        .replace(/\?/g, '.')
        .replace(/\*/g, '^');
    };
  
    let fileName;
    // Get proper name if we are fail on hook
    if (test.ctx.test.type === 'hook') {
      const currentTest = { test: test.ctx.test };
      // ignore retries if we are in hook
      test._retries = -1;
      fileName = clearString(`${test.title}_${currentTest.test.title}`);
    } else {
      fileName = clearString(test.title);
    }
    if (uniqueScreenshotNames) {
      const uuid = test.uuid || test.ctx.test.uuid;
      fileName = `${fileName.substring(0, 10)}_${uuid}`;
    }
    if (test._retries < 1 || test._retries === test.retryNum) {
      fileName = `${fileName}.failed.png`;
    }
  
    return fileName
}

/**
 * Create a mapping between step and location in source file
 */
const mapStepToSource = step => {
  const sourceFileName = step.line().match(/\(([^)]*):[0-9]+:[0-9]+\)/)[1]
  const sourceLine = step.line().match(/:([0-9]+):/)[1]

  return {
    name: step.name,
    sourceFile: sourceFileName,
    sourceLine: Number(sourceLine)
  }
}

/**
 * Stringify with circular refs
 */
const stringify = (o) => { 
  // Note: cache should not be re-used by repeated calls to JSON.stringify.
  var cache = [];
  const res = JSON.stringify(o, function(key, value) {
      if (typeof value === 'object' && value !== null) {
          if (cache.indexOf(value) !== -1) {
              // Circular reference found, discard key
              return;
          }
          // Store value in our collection
          cache.push(value);
      }
      return value;
  });
  cache = null; // Enable ga

  return res
}

const writeStringToFileSync = (filename, str) => fs.writeFileSync(filename, str)

module.exports = {
    getErrorScreenshotFileName,
    mapStepToSource,
    stringify,
    writeStringToFileSync
}