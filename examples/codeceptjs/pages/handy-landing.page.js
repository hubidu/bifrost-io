const cookieDialog = {
  domain: '.check24.de',
  httpOnly: false,
  name: 'c24cb',
  path: '/',
  secure: false,
  value: '1'
}

module.exports = {

  _init() {
    I = require('../custom-steps.js')();
  },

  IGoTo() {
    I.amOnPage('https://www.check24.de/handytarife')

    // Hide cookie dialog
    I.setCookie(cookieDialog)
    I.refreshPage()
  },

  IClickJetztVergleichen() {
    // NOTE: For puppeteer this requires a fix (see https://github.com/Codeception/CodeceptJS/issues/1127)
    I.click('jetzt vergleichen', 'button')
  }
}
