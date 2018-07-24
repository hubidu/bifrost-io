const git = require('git-last-commit')

module.exports = () => new Promise((resolve, reject) => {
    git.getLastCommit((err, commit) => {
        if (err) return reject(err)

        return resolve(commit)
    })
})