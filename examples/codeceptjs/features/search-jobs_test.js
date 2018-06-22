Feature('Search jobs')

Scenario(`When I search for react jobs I should get matching job offers`, 
async (I) => {
    I.amOnPage('https://jobs.check24.de/')
    I.fillField('#search', 'react mocha docker')
    I.clickVisible('Job finden') // Depending on the screen size there may be two such elements
    I.waitInUrl('/search')
    I.seeNumberOfVisibleElements('.vacancy--boxitem', 1)
})