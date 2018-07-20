const test = require('ava')
const extractBaseUrl = require('./extract-base-url')

test('it should extract the base part from an url', t => {
    const url = 'https://unfallversicherung.check24-test.de/offer/d9a19519-63ea-43d4-a174-71df030886b3/policy-holder-data?next=true'
    const result = extractBaseUrl(url)

    t.deepEqual(result, 'https://unfallversicherung.check24-test.de')
})