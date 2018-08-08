
Feature('Performance @performance');

Scenario('When I visit multiple pages performance logs should be collected for all of them', 
(I) => {
    I.amOnPage('http://www.check24.de')
    I.scrollPageToBottom()
    I.wait(3)
    I.scrollPageToTop()

    I.click('#c24-meinkonto')

    I.click('#c24-header-bottom > div > nav > div > div.c24-nav-sec > ul > li.c24-mainnav-sec-section.c24-nav-konto > a')
    I.click('#c24-header-bottom > div > nav > div > div.c24-nav-sec > ul > li.c24-mainnav-sec-section.c24-nav-insurance')

    I.amOnPage('http://www.github.com')
    I.amOnPage('http://www.gmail.com')
})
