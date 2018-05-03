const UAParser = require('ua-parser-js')

module.exports = (userAgent, viewportSize) => {
    const uap = new UAParser(userAgent)
    
    return {
        name: 'desktop', // TODO Device name probably should come from config or env var
        type: uap.getDevice().type || 'desktop', // mobile, tablet, desktop ...
        browser: uap.getBrowser().name.toLowerCase(), // name of the browser: chrome, firefox ...
        browserVersion: uap.getBrowser().version,
        os: uap.getOS().name,
        width: viewportSize.width,
        height: viewportSize.height
    }
}
