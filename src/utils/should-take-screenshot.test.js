const test = require('ava')
const shouldTakeScreenshot = require('./should-take-screenshot')

test('it should take screenshots on click methods in before hooks', t => {
    const result = shouldTakeScreenshot('before', 'click')
    t.is(true, result)
})

test('it should take screenshots on see methods in before hooks', t => {
    const result = shouldTakeScreenshot('before', 'see')
    t.is(true, result)
})

test('it should take screenshots on seeElement methods in before hooks', t => {
    const result = shouldTakeScreenshot('before', 'seeElement')
    t.is(true, result)
})

test('it should NOT take screenshots on amOnPage methods in before hooks', t => {
    const result = shouldTakeScreenshot('before', 'amOnPage')
    t.is(false, result)
})

test('it should take screenshots on amOnPage methods in after hooks', t => {
    const result = shouldTakeScreenshot('after', 'amOnPage')
    t.is(true, result)
})

test('it should NOT take screenshots on click methods in after hooks', t => {
    const result = shouldTakeScreenshot('after', 'click')
    t.is(false, result)
})