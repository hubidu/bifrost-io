const url = require('url')

module.exports = str => {
    const parsed = url.parse(str);
    return `${parsed.protocol}//${parsed.host}${parsed.port ? ':' : ''}${parsed.port ? parsed.port : ''}`
}