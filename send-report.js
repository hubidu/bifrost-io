const fs = require('fs')
const rp = require('request-promise')

const HOST = process.env.DASHBOARD_HOST
const PORT = process.env.DASHBOARD_PORT
const UPLOAD_URL = `http://${HOST}:${PORT}/upload`;

module.exports = async zipFile => {
    const formData = {
        report_data: fs.createReadStream(zipFile)
    }

    await rp.post({url: UPLOAD_URL, formData})
};
