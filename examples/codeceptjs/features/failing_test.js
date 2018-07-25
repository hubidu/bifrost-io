const assert = require('assert')

Feature('Failing test scenarios');

Scenario('The test will fail and should still get a report When I throw an assertion @failing', async (I) => {
    I.amOnPage('http://www.check24.de')
    assert(false, 'Throw an assertion')    
})

Scenario('The test will fail When an element on the page can not be found @failing', async (I) => {
    I.amOnPage('http://www.check24.de')
    I.click('#this-selector-does-not-exist')
})

Scenario('The test will fail When checking for a non-existing element within a context @failing', async (I) => {
    I.amOnPage('http://www.check24.de')
    within('.c24-comparison-container', () => {
        I.click('this-selector-does-not-exist')
    })
})