const path = require('path')

const normalizePath = (suitePath) => {
  return suitePath.split(path.sep).join(' -- ')
}

module.exports = normalizePath
