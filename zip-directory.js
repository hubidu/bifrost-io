const path = require('path')
const fs = require('fs')
const archiver = require('archiver')

const zipDirectory = (dir, asDirInZip) => new Promise((resolve, reject) => {
    const archive = archiver('zip', {
        zlib: { level: 9 } // Sets the compression level.
    })

    const zipFileName = path.join(dir + '.zip')
    const zipFile = fs.createWriteStream(zipFileName)
    zipFile.on('close', () => resolve(zipFileName));
    zipFile.on('error', () => reject());

    archive.pipe(zipFile)
    archive.directory(dir, asDirInZip)
    archive.finalize()
})

module.exports = zipDirectory;
