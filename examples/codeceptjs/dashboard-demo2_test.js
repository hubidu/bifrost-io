
Feature('Failing tests');

Scenario('This test will fail because the element can not be found', async (I) => {
    I.amOnPage('http://www.check24.de')
    I.click('#c24-meinkonto_sdfdfsd')
})