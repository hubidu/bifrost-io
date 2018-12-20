const assert = require('assert')

Feature('Failing test scenarios');

Scenario('The test will fail and should still get a report When I throw an assertion @failing @assert', async (I) => {
    I.amOnPage('http://www.check24.de')
    assert(false, 'Throw an assertion')
})

Scenario('The test will fail When an element on the page can not be found @failing', async (I) => {
    I.amOnPage('http://www.check24.de')
    I.click('body #this-selector-does-not-exist')
})

Scenario('The test will fail When checking for a non-existing element within a context @failing', async (I) => {
    I.amOnPage('http://www.check24.de')
    within('.c24-comparison-container', () => {
        I.click('this-selector-does-not-exist')
    })
})

Scenario('When the error message is a js object a report should still be generated @failing @with-object', async (I) => {
  I.amOnPage('http://www.check24.de')
  const errorAsObject = {
    message: 'Some error message',
    foo: 'bar'
  }
  I.assertThat(false, errorAsObject)
})
