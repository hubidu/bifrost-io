
Feature('Failing test scenarios');

Scenario('The test will fail when an element on the page can not be found', async (I) => {
    I.amOnPage('http://www.check24.de')
    I.click('#this-selector-does-not-exist')
})