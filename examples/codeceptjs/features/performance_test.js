
Feature('Performance @performance');

Scenario('When I visit multiple pages performance logs should be collected for all of them',
(I) => {
    I.say('I go to CHECK24 and do some scrolling')
    I.amOnPage('http://www.check24.de')
    I.scrollPageToBottom()
    I.wait(3)
    I.scrollPageToTop()

    I.say('I navigate to subpages and hope to trigger page loads')
    I.click('body #c24-meinkonto')

    I.click('body #c24-header-bottom > div > nav > div > div.c24-nav-sec > ul > li.c24-mainnav-sec-section.c24-nav-konto > a')
    I.click('body #c24-header-bottom > div > nav > div > div.c24-nav-sec > ul > li.c24-mainnav-sec-section.c24-nav-insurance')

    I.say('I go to github')
    I.amOnPage('http://www.github.com')

    I.say('I go to gmail')
    I.amOnPage('http://www.gmail.com')
})
