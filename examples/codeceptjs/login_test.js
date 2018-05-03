
Feature('Login Scenarios');

Scenario('When I login with an invalid username and password then I will see an error message', async (I, loginPage) => {
    I.amOnPage('http://www.check24.de')
    I.click('#c24-meinkonto')

    I.click('Anmelden')

    loginPage.loginWith('Foo', 'Bar')
    
    I.see('Bitte geben Sie', '.error-desc')
});

