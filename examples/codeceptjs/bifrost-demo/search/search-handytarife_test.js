const assert = require('assert')

Feature('Search for Handytarife @search @flaky')

const randomInt = num => Math.floor(Math.random() * num)

Scenario(`When I search for "Handytarife" without specifying any details Then I will get a list of various tariffs\
 @search @handy`,
async (I, onHandyTariffsPage, onHandyLandingPage) => {
    I.say('I goto the CHECK24 Handytarife landing page')
    onHandyLandingPage.IGoTo()

    I.say('I click the "jetzt vergleichen" button')
    onHandyLandingPage.IClickJetztVergleichen()

    I.say('I check the elements on the result page')
    onHandyTariffsPage.IWaitToLoad()
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

    I.say('I see that the best tariff for the 3GB option is "Allnet-Flat Comfort"')
    // There is a hidden flakiness here, because
    // even when the spinner disappears the result list might not yet
    // have been updated
    I.waitForInvisible('.spin-item')

    onHandyTariffsPage.ISeeNthProvider('Allnet-Flat Comfort', 1)

    I.say('I expect the price to be less than 10 EUR')
    const netPrice = await onHandyTariffsPage.IGrabBestPrice()

    assert(netPrice < 10, `Expected best price ${netPrice} to be less than 10 EUR`)
})
