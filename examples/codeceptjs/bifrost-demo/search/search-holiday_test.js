/**
 * This is also a good example of a flaky test, so lets add a retry
 */
Feature('Search holiday destinations @datadriven', { retry: 1 })

const destinations = new DataTable(['destination', 'airport']);
destinations.add(['Mallorca', 'München'])
destinations.add(['Mallorca', 'Frankfurt'])

Data(destinations).Scenario(`When I search for various holiday destinations from different airports I should always get some results @search @holiday`,
async (I, current) => {

    I.say('I goto CHECK24 Reise')
    I.amOnPage('https://urlaub.check24.de/produkte')

    I.say('I enter destination')
    I.fillField('body #c24-travel-destination-element', current.destination)

    I.say('I enter origin')
    // I.pressKey('Enter')
    I.wait(1)
    I.pressKey('Tab')
    I.fillField('body #c24-travel-airport-element', current.airport)
    // I.pressKey('Enter')
    I.wait(1)

    I.saveScreenshot('after-destination-airport.png')

    I.say('I select the duration of my trip')
    I.pressKey('Tab')
    I.pressKey('Tab')
    I.pressKey('Tab')
    I.pressKey('Tab')
    I.pressKey('Tab')
    I.wait(1)
    // I.clickVisible('label[for="duration-2"]')
    I.selectOption('#c24-travel-travel-duration-element', '1w')

    I.say('I click the search button')
    I.click('Reise finden')

    I.say('I check the results')
    I.waitInUrl('/suche')
    I.waitForText('Ergebnisse', '.js-hotel-headline')
    I.waitForInvisible('span.detached-loader')
    I.waitForVisible('.hotel-list-offer-link')
    I.seeElement('.hotel-list-offer-link')
})
