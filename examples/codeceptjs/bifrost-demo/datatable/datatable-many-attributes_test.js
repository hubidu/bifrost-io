Feature('@datatable Data table scenarios', {retries: 0});

let parameter = new DataTable([
    'jobSituation', 'occupation', 'education', 'age', 'fractionOfficeWork', 'staffResponsibility', 'industry', 'familyStatus', 'smoker', 'benefit', 'benefitAgeLimit', 'resultCounter', 'expensivePrice', 'cheapestPrice', 'mostExpensiveTariff', 'cheapestTariff'
]);
parameter.add([
    'Angestellter oder Selbständiger', 'Industriekaufmann,frau', 'Berufsausbildung', '26', '100', '0', 'Stahl', 'Keine Angabe', 'nein', '1500', '65', '49', '132,51', '40,94', 'WWK - BioRisk Komfort', 'Nürnberger - >SBU2901 Comfort'
]);

Data(parameter).
Scenario('When the test has a lots of data attributes, Then a report is not created @failing', function(I, current) {
    I.amOnPage('http://www.check24.de');
    I.see('something that is not there');
});

Scenario('When the test has no data or a small data table Then a report is created @failing', function(I) {  
    I.amOnPage('http://www.check24.de');
    I.see('something that is not there');
});