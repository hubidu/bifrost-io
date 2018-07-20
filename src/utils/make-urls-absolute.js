module.exports = (html, pageBaseUrl) => {
    html = html.replace(/(href="\/)([^\/])/gi, `href="${pageBaseUrl}/$2`)
    html = html.replace(/(src="\/)([^\/])/gi, `src="${pageBaseUrl}/$2`)
    return html
}