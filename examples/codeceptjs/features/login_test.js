
Feature('Login');

Scenario('When I login with an invalid username and password then I will see an error message', 
(I, loginPage) => {
    I.amOnPage('http://www.check24.de')
    I.click('#c24-meinkonto')
    I.click('Anmelden')

    loginPage.loginWith('Foo', 'Bar') // Login using a page object
    
    I.see('Bitte geben Sie', '.error-desc') // Error messages must be shown
    I.seeInField('#password', '') // Password must be reset
})
