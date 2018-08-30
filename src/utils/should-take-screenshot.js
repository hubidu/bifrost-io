const DefaultAutoscreenshotMethods = [
    { name: /^click.*/, before: true, after: false, selector: { 1: 1, 2: 2 } },
    { name: /^tap.*/, before: true, after: false, selector: {} },
    { name: /^seeElement*/, before: true, after: false, selector: { 1: 1 } },
    { name: /^see.*/, before: true, after: false, selector: { 2: 2 } },
    { name: /^say$/, before: true, after: false, selector: { } },
    { name: /^amOnPage$/, before: false, after: true, selector: { } },
    { name: /^grabTextFrom$/, before: true, after: false, selector: { 1: 1 } },
    { name: /^grabValueFrom$/, before: true, after: false, selector: { 1: 1 } },
]

module.exports = (beforeOrAfterStep, stepName) => {        
    const foundMethod = DefaultAutoscreenshotMethods.find(item => item.name.test(stepName))
    if (!foundMethod) return false
    
    return beforeOrAfterStep === 'before' && 
        foundMethod.before || beforeOrAfterStep === 'after' && foundMethod.after
}