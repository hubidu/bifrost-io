const git = require('git-last-commit')

module.exports = () => new Promise((resolve, reject) => {
    git.getLastCommit((err, commit) => {
        if (err) return reject(err)

        // Fix dates
        commit.committedOn = Number(commit.committedOn)
        commit.authoredOn = Number(commit.authoredOn)

        return resolve(commit)
    }, { dst: process.cwd() })
})