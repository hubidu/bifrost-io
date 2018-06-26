const assert = require('assert')

Feature('Search for Handytarife @search')

Scenario(`When I search for "Handytarife" without specifying any details Then I will get a list of various tariffs @search_handy`, 
async (I) => {
    const toNumber = arr => {
        if (!Array.isArray(arr)) arr = [arr]
        return arr.map(priceAsStr => Number(priceAsStr.replace(' €', '').replace(',', '.')))
    }

    I.amOnPage('https://www.check24.de/handytarife')

    const cookieDialog = {
        domain: '.check24.de',
        httpOnly: false,
        name: 'c24cb',
        path: '/',
        secure: false,
        value: '1'
      }   
    await I.setCookie(cookieDialog)
    await I.refreshPage()
    
    // NOTE: For puppeteer this requires a fix (see https://github.com/Codeception/CodeceptJS/issues/1127)
    I.click('jetzt vergleichen', 'button')

    I.waitInUrl('/handytarife/vergleich')
    I.see('Handytarife im Vergleich', 'h1')
    I.seeElement('//filter')
    I.seeElement('product-item')

    const prices = await I.grabTextFrom('product-item:nth-child(1) .price')
    const netPrice = toNumber(prices)[0]
    assert(netPrice < 10, 'Expected best price to be less than 10 EUR')
})