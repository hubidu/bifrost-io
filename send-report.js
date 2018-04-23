const assert = require('assert')
const fs = require('fs')
const rp = require('request-promise')
const debug = require('debug')('dashboard-client')

const HOST = process.env.DASHBOARD_HOST
const PORT = process.env.DASHBOARD_PORT || 8000
const UPLOAD_URL = `http://${HOST}:${PORT}/upload`;

const sendReport = async zipFileName => {
    assert(zipFileName, 'Expected a path to a zip file')

    debug('Uploading zipped report data', zipFileName)

    const formData = {
        report_data: fs.createReadStream(zipFileName)
    }

    await rp.post({url: UPLOAD_URL, formData})
    debug('Successfully uploaded zipped report data', zipFileName)
}

const isDashboardHostConfigured = () => HOST !== undefined

module.exports = {
    sendReport,
    isDashboardHostConfigured
}
