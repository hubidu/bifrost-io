const assert = require('assert')

const randomInt = num => Math.floor(Math.random() * num)

Feature('Search for Handytarife @search')

Scenario(`When I search for "Handytarife" without specifying any details Then I will get a list of various tariffs @search_handy`, 
async (I, onHandyTariffsPage) => {
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
    
    onHandyTariffsPage.IWaitToLoad()
    
    onHandyTariffsPage.ISeeHeadline()
    onHandyTariffsPage.ISeeFilterWidget()
    onHandyTariffsPage.ISeeHandyTariffs()
    onHandyTariffsPage.ISeeNthProvider(['Allnet Flat', 'Foo 1984'][randomInt(2)], 1)

    const netPrice = await onHandyTariffsPage.IGrabBestPrice()

    assert(netPrice < 10, 'Expected best price to be less than 10 EUR')
})