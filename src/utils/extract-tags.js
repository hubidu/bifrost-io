const removeTags = (str, tags) => tags ? tags.reduce((agg, tag) => agg.replace(tag, ''), str) : str

module.exports = (str) => {
    const m = str.match(/(@[^\s]+)/g)
    return {
        tags: m || [],
        str: removeTags(str, m).trim()
    }
}