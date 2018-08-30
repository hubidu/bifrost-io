const assert = require('assert')


Feature('Search for Handytarife @search @flaky')

const cookieDialog = {
    domain: '.check24.de',
    httpOnly: false,
    name: 'c24cb',
    path: '/',
    secure: false,
    value: '1'
}   
const randomInt = num => Math.floor(Math.random() * num)

Scenario(`When I search for "Handytarife" without specifying any details Then I will get a list of various tariffs @search @handy`, 
async (I, onHandyTariffsPage) => {
    I.amOnPage('https://www.check24.de/handytarife')

    // Hide cookie dialog
    await I.setCookie(cookieDialog)
    await I.refreshPage()
    
    // NOTE: For puppeteer this requires a fix (see https://github.com/Codeception/CodeceptJS/issues/1127)
    I.click('jetzt vergleichen', 'button')
    
    onHandyTariffsPage.IWaitToLoad()
    
    onHandyTariffsPage.ISeeHeadline()
    onHandyTariffsPage.ISeeFilterWidget()
    onHandyTariffsPage.ISeeHandyTariffs()

    // Introduce some flakiness
    if (randomInt(2) > 0) {
        I.selectOption('#data_included', 'ab 8 GB')
    } else {
        I.selectOption('#data_included', 'ab 3 GB')
    }
    
    // There is a hidden flakiness here, because
    // even when the spinner disappears the result list might not yet
    // have been updated
    I.waitForInvisible('.spin-item')

    onHandyTariffsPage.ISeeNthProvider('Allnet-Flat Comfort', 1) // Best provider expected for 3GB option

    const netPrice = await onHandyTariffsPage.IGrabBestPrice()

    assert(netPrice < 10, `Expected best price ${netPrice} to be less than 10 EUR`)
})