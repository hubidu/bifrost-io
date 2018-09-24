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
    I.say('I goto the CHECK24 Handytarife landing page')
    I.amOnPage('https://www.check24.de/handytarife')

    // Hide cookie dialog
    await I.setCookie(cookieDialog)
    await I.refreshPage()

    I.say('I click the "jetzt vergleichen" button')
    // NOTE: For puppeteer this requires a fix (see https://github.com/Codeception/CodeceptJS/issues/1127)
    I.click('jetzt vergleichen', 'button')

    onHandyTariffsPage.IWaitToLoad()

    I.say('I check the elements on the result page')
    onHandyTariffsPage.ISeeHeadline()
    onHandyTariffsPage.ISeeFilterWidget()
    onHandyTariffsPage.ISeeHandyTariffs()

    I.say('I select Datenvolumen 3 GB or 8 GB randomly')
    // Introduce some flakiness
    if (randomInt(2) > 0) {
      onHandyTariffsPage.ISelectDatenvolumen('ab 8 GB')
    } else {
      onHandyTariffsPage.ISelectDatenvolumen('ab 3 GB')
    }

    I.say('I see that the best tariff is "Allnet-Flat Comfort"')
    // There is a hidden flakiness here, because
    // even when the spinner disappears the result list might not yet
    // have been updated
    I.waitForInvisible('.spin-item')

    onHandyTariffsPage.ISeeNthProvider('Allnet-Flat Comfort', 1) // Best provider expected for 3GB option

    I.say('I expect the price to be less than 10 EUR')
    const netPrice = await onHandyTariffsPage.IGrabBestPrice()

    assert(netPrice < 10, `Expected best price ${netPrice} to be less than 10 EUR`)
})
