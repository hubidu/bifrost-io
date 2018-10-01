const path = require('path')

const normalizePath = (suitePath) => {
  return suitePath.split(path.sep).map(pathItem => pathItem.trim()).join(' -- ')
}

module.exports = normalizePath
