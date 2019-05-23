const removeTags = (str, tags) => tags ? tags.reduce((agg, tag) => agg.replace(tag, ''), str) : str
const onlyUnique = (value, index, self) => self.indexOf(value) === index

module.exports = (str) => {
  // First throw away any data in the suite title
  const parts = str.split('|')
  const title = parts[0]
  const data = parts[1]

  // Extract tags from the rest
  const m = title.match(/(@[^\s]+)/g)

  let titleWithoutTags = removeTags(title, m).trim()
  if (data) titleWithoutTags += ' | ' + data

  return {
      tags: m ? m.filter(onlyUnique) : [],
      str: titleWithoutTags
  }
}
