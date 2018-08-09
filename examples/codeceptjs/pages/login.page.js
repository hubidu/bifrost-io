
'use strict';

let I;

module.exports = {

  _init() {
    I = require('../custom-steps.js')();
  },

  loginWith(username, password) {
    I.fillField('body #email', username)
    I.fillField('body #password', password)
    I.click('body #c24-kb-register-btn')
  }
}
