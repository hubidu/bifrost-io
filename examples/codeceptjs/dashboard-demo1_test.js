
Feature('Login Scenarios');

Scenario('A Login with invalid username and password should show an error message', async (I, loginPage) => {
    I.amOnPage('http://www.check24.de')
    I.click('#c24-meinkonto')

    I.click('Anmelden')

    loginPage.loginWith('Foo', 'Bar')
    
    I.see('Bitte geben Sie', '.error-desc')
});

