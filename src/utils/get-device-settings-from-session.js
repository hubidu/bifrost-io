const isWebView = session => session.browserName !== undefined

module.exports = session => {
    if (isWebView(session)) {
        return {
            name: 'unknown',
            type: session.platform.toLowerCase(),
            browser: session.browserName,
            browserVersion: session.version,
            os: session.platform,
            width: undefined,
            height: undefined    
        }
    }

    return {
        name: session.deviceName,
        type: session.platformName.toLowerCase(),
        browser: undefined,
        browserVersion: undefined,
        os: session.platform,
        width: session.viewportRect.width,
        height: session.viewportRect.height
    }
}
