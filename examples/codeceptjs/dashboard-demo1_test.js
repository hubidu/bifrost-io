
Feature('Login');

Scenario('Login with invalid credentials', async (I) => {
    I.amOnPage('http://www.check24.de')
    I.click('#c24-meinkonto')

    I.click('Anmelden')

    I.fillField('#email', 'Foo')
    I.fillField('#password', 'bar')
    I.click('#c24-kb-register-btn')
});

