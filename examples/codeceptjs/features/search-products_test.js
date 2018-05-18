Feature('Search for Handytarife')

Scenario(`When I search for "Handytarife" without specifying any details Then I will get a list of various tariffs`, 
async (I) => {
    I.amOnPage('https://www.check24.de/handytarife')

    I.click('jetzt vergleichen', 'button')

    I.waitInUrl('/handytarife/vergleich')
    I.see('Handytarife im Vergleich', 'h1')
    I.seeElement('//filter')
    I.seeElement('product-item-anniversary')
})