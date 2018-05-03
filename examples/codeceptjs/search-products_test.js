Feature('Search products')

Scenario('When I search for "Handytarife" then I will see matching results', async (I) => {
    I.amOnPage('https://www.check24.de/handytarife')
    // I.waitForText('jetzt vergleichen')
    I.click('jetzt vergleichen', '#c24-content > emotion > landingpage-filter:nth-child(4) > ng-transclude > form > div > button')
    
    I.see('Handytarife im Vergleich', 'h1')
    I.seeElement('product-list product-item')
})