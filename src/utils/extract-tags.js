const removeTags = (str, tags) => tags ? tags.reduce((agg, tag) => agg.replace(tag, ''), str) : str
const onlyUnique = (value, index, self) => self.indexOf(value) === index

module.exports = (str) => {
    const m = str.match(/(@[^\s]+)/g)
    return {
        tags: m ? m.filter(onlyUnique) : [],
        str: removeTags(str, m).trim()
    }
}