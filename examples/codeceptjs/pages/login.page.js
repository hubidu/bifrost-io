
'use strict';

let I;

module.exports = {

  _init() {
    I = require('../custom-steps.js')();
  },

  loginWith(username, password) {
    I.fillField('#email', username)
    I.fillField('#password', password)
    I.click('#c24-kb-register-btn')
  }
}
