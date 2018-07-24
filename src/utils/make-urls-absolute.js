module.exports = (html, pageBaseUrl) => {
    // Make all links absolute pointing to the page url
    html = html.replace(/(href="\/)([^\/])/gi, `href="${pageBaseUrl}/$2`)
    html = html.replace(/(src="\/)([^\/])/gi, `src="${pageBaseUrl}/$2`)

    // Disable all script tags
    html = html.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    return html
}