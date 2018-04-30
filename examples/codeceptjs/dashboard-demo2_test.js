
Feature('Failing test scenarios');

Scenario('It should fail when an element on the page can not be found', async (I) => {
    I.amOnPage('http://www.check24.de')
    I.click('#c24-meinkonto_sdfdfsd')
})