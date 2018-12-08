Feature('@hooks Failures in before each hooks')

Before((I) => {
    I.amOnPage('https://www.check24.de')
    I.see('a not existing text') // Hook will fail here
})

Before((I) => {
    I.amOnPage('https://www.check24.de/versicherungscenter') // we won't get here
})

Scenario(`When the test fails in a before() hook, a report should still be created @failing`, 
async (I) => {
    I.amOnPage('https://www.check24.de/handytarife') // we won't get here
})