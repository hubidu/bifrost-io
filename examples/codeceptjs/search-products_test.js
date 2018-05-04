Feature('Search products')

Scenario(`When I search for "Handytarife" without specifying any details Then I should see a list of tariffs`, 
async (I) => {
    I.amOnPage('https://www.check24.de/handytarife')

    I.click('jetzt vergleichen', '#c24-content > emotion > landingpage-filter:nth-child(4) > ng-transclude > form > div > button')

    I.waitInUrl('/handytarife/vergleich')
    I.see('Handytarife im Vergleich', 'h1')
    I.seeElement('product-list product-item')
})