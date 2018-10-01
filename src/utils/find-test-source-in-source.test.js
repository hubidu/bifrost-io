const test = require('ava')
const findTestSourceInSource = require('./find-test-source-in-source')

test.only('it should find the needle in an haystack (abstract example)', t => {
  const completeSource = `A
  B
  C
  A
  A
  B
  D`
  const testSource = `C
  A`
  const startLine = findTestSourceInSource(completeSource, testSource)

  t.is(3, startLine)
})

test('it should find the start of the test function in the complete source code', t => {
  const completeSource = `Feature('Hello World');

  Scenario('I see the google logo When I go to google.de @hello', (I) => {
      I.say('I go to google')
      I.amOnPage('http://www.google.de')

      I.say('I should see the google logo')
      I.seeElement('body #hplogo')
  })
  `
  const testSource = `Scenario('I see the google logo When I go to google.de @hello', (I) => {
    I.say('I go to google')
    I.amOnPage('http://www.google.de')

    I.say('I should see the google logo')
    I.seeElement('body #hplogo')
  })
  `
  const startLine = findTestSourceInSource(completeSource, testSource)

  t.is(3, startLine)
})
