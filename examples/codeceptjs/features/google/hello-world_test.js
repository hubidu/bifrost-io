Feature('Hello World');

Scenario('I see the google logo When I go to google.de @hello', (I) => {
    I.amOnPage('http://www.google.de')
    I.seeElement('body #hplogo')
})
