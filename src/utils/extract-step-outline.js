
const unquote = str => str.replace(/^("|')/, '').replace(/("|')$/, '')

const extractStepOutline = source => {
  const lines = source.split('\n')

  return lines
      .map(l => l.trim())
      .map((l, i) => {
        const match =  l.match(/I.say\s*\((.*)\)/)
        if (match) {
          return {
            step: unquote(match[1].trim()),
            line: i
          }
        }
        return undefined
      })
      .filter(l => !!l)
}

module.exports = extractStepOutline
