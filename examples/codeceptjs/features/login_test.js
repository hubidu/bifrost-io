
Feature('Login');

Scenario('When I login with an invalid username and password then I will see an error message @login', 
(I, loginPage) => {
    I.amOnPage('http://www.check24.de')
    I.say('I click "Anmelden" on the landing page')
    I.click('body #c24-meinkonto')
    I.click('Anmelden')

    I.say('I login with incorrect username and password')
    loginPage.loginWith('Foo', 'Bar') // Login using a page object
    
    I.say('I see some error messages')
    I.see('Bitte geben Sie', '.error-desc') // Error messages must be shown
    I.seeInField('body #password', '') // Password must be reset
})
