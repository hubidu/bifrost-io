Feature('Acceptance Test Driven Development @tags');

Scenario('When this test tagged with ATDD fails on line 5 it will be marked as success and an ATDDIsUnmet tag will be added @ATDD:5', (I) => {
    I.amOnPage('http://www.google.de')
    I.seeElement('body #hplog')
})

Scenario('When this test tagged with ATDD fails on line 10 but not on 11 the test will fail as usual @failing @ATDD:10', (I) => {
    I.amOnPage('http://www.google.de')
    I.seeElement('body #hplogo')
    I.see('Something which is not there')
})

Scenario('When a test tagged with ATDD succeeds, heimdall will remove the ATDD tag @ATDD:16', (I) => {
    I.amOnPage('http://www.google.de')
    I.seeElement('body #hplogo')
})

Scenario('When this test tagged  with a failing tag fails, it should be shown as successful @failing', (I) => {
    I.amOnPage('http://www.google.de')
    I.see('Something which is not there')
})

Scenario('When this test tagged with a failing tag succeeds, it should be shown as failed (failing tests MUST NOT succeed) @failing', (I) => {
    I.amOnPage('http://www.google.de')
})

Scenario('When the test contains a story tag it should be linked to the issue tracker @story:FOO-12345', (I) => {
    I.amOnPage('http://www.google.de')
})

