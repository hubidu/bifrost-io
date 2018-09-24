Feature('Hello World');

Scenario('I see the google logo When I go to google.de @hello', (I) => {
    I.say('I go to google')
    I.amOnPage('http://www.google.de')

    I.say('I should see the google logo')
    I.seeElement('body #hplogo')
})
