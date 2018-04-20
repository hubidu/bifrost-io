const path = require('path')
const fs = require('fs')
const archiver = require('archiver')

const zipDirectory = dir => new Promise((resolve, reject) => {
    const archive = archiver('zip', {
        zlib: { level: 9 } // Sets the compression level.
    })

    const zipFile = fs.createWriteStream(path.join(dir + '.zip'))
    zipFile.on('close', () => resolve());
    zipFile.on('error', () => reject());

    archive.pipe(zipFile)
    archive.directory(dir, false)
    archive.finalize()
})

module.exports = zipDirectory;
