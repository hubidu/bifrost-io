const assert = require('assert')

Feature('Search for Handytarife')

Scenario(`When I search for "Handytarife" without specifying any details Then I will get a list of various tariffs`, 
async (I) => {
    const toNumber = arr => arr.map(priceAsStr => Number(priceAsStr.replace(' €', '').replace(',', '.')))

    I.amOnPage('https://www.check24.de/handytarife')
    I.click('jetzt vergleichen', 'button')

    I.waitInUrl('/handytarife/vergleich')
    I.see('Handytarife im Vergleich', 'h1')
    I.seeElement('//filter')
    I.seeElement('product-item')

    const prices = await I.grabTextFrom('product-item:nth-child(1) .price')
    const netPrice = toNumber(prices)[0]
    assert(netPrice < 10, 'Expected best price to be less than 10 EUR')
})