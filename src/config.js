const fs = require('fs')
const path = require('path')

const CONFIG_FILE = path.join(process.cwd(), '.bifrost.js')

const cfg = {
    ownerkey: process.env.OWNER_KEY,
    project: process.env.TEST_PROJECT || path.basename(process.cwd()),
    testBaseDir: path.join(process.cwd(), 'features')
}
let cfgFromFile = {}

if (fs.existsSync(CONFIG_FILE)) {
    cfgFromFile = require(CONFIG_FILE)
}

module.exports = Object.assign({}, cfg, cfgFromFile)
