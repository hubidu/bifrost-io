const test = require('ava')
const makeUrlsAbsolute = require('./make-urls-absolute')

test('it should make urls absolute', t => {
    const html = '<link href="/main.css"/> <link href="//main.css"/>'
    const result = makeUrlsAbsolute(html, 'http://foo.com')
    t.deepEqual(result, '<link href="http://foo.com/main.css"/> <link href="//main.css"/>')
})