
Feature('Failing test scenarios');

Scenario('OK TO FAIL: The test will fail when an element on the page can not be found', async (I) => {
    I.amOnPage('http://www.check24.de')
    I.click('#this-selector-does-not-exist')
})

Scenario('OK TO FAIL: The test will fail when checking for a non-existing element within a context', async (I) => {
    I.amOnPage('http://www.check24.de')
    within('.c24-comparison-container', () => {
        I.click('this-selector-does-not-exist')
    })
})