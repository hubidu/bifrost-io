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
  const mapSingleStackLine = (stepName, stepLine) => {
    const sourceFileName = stepLine.match(/\(([^)]*):[0-9]+:[0-9]+\)/)[1]
    const sourceLine = stepLine.match(/:([0-9]+):/)[1]
  
    return {
      name: stepName,
      sourceFile: sourceFileName,
      sourceLine: Number(sourceLine)
    }  
  }

  // if (step.name === 'click') {
  //   console.log(step.name, step.args)
  //   console.log(step.stack)
  // }

  const stackLines = step.stack.split('\n').splice(3)
  const indexOfTestStackLine = stackLines.findIndex(l => l.indexOf('Test.Scenario') > -1)
  let stacklinesUpToTestFile = stackLines.slice(0, indexOfTestStackLine + 1)

  if (stacklinesUpToTestFile.length === 0) {
    /* NOTE It obviously can happen that the test file is not part of the stacktrace
     *   I guess it has to do with all the asynchronous operations going on
     */
    // console.log(`INFO Could not find the test file in command stack trace of '${step.name} ${step.args.join(',')}'. This can happen with codeceptjs.`)
    // Use all the available stack lines
    stacklinesUpToTestFile = [step.stack.split('\n')[3]]
  }

  return stacklinesUpToTestFile
    .map(stackLine => mapSingleStackLine(step.name, stackLine))
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