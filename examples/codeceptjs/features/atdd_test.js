Feature('Acceptance Test Driven Development @heimdall');

Scenario('When the test fails on line 5 it will be marked as success and an ATDDIsUnmet tag will be added @ATDD:5', (I) => {
    I.amOnPage('http://www.google.de')
    I.seeElement('body #hplog')
})

Scenario('When the test fails on line 10 but not on 11 the test will fail as usual @ATDD:10 @failing', (I) => {
    I.amOnPage('http://www.google.de')
    I.seeElement('body #hplogo')
    I.see('Something which is not there')
})

Scenario('When the test succeeds heimdall will remove the tag @ATDD:16', (I) => {
    I.amOnPage('http://www.google.de')
    I.seeElement('body #hplogo')
})


