/**
 * This is also a good example of a flaky test, so lets add a retry
 */
Feature('Search holiday destinations', { retry: 1 })

const destinations = new DataTable(['destination', 'airport']);
destinations.add(['Mallorca', 'München'])
destinations.add(['Mallorca', 'Frankfurt'])

Data(destinations).Scenario(`When I search for various holiday destinations from different airports I should always get some results @search @holiday`, 
async (I, current) => {
    I.amOnPage('https://urlaub.check24.de/produkte')
    I.fillField('#destination-element', current.destination)
    I.pressKey('Enter')
    I.wait(1)
    I.pressKey('Tab')
    I.fillField('#airport-element', current.airport)
    I.pressKey('Enter')
    I.wait(1)

    I.saveScreenshot('after-destination-airport.png')

    I.pressKey('Tab')
    I.pressKey('Tab')
    I.pressKey('Tab')
    I.pressKey('Tab')
    I.pressKey('Tab')
    I.wait(1)
    I.clickVisible('label[for="duration-2"]')
    I.click('Reise finden') 

    I.waitInUrl('/suche')
    I.waitForText('Ergebnisse', '.js-hotel-headline')
    I.waitForInvisible('span.detached-loader')
    I.waitForVisible('.hotel-list-offer-link')
    I.seeElement('.hotel-list-offer-link')
})