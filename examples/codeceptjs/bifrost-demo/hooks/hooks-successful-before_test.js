Feature('Successful before each hooks')

Before((I) => {
    I.amOnPage('https://www.check24.de')
    I.seeElement('.c24-logo')
})

Before((I) => {
    I.amOnPage('https://www.check24.de/versicherungscenter')
})

Scenario(`When there are hooks the report for the scenario should also include the hook steps`,
  async (I) => {
      I.amOnPage('https://www.check24.de/handytarife')
  })
