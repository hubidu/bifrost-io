'use strict';
let I;

const {isMobilePhone, isTablet} = require('../devices')

const toNumber = arr => {
    if (!Array.isArray(arr)) arr = [arr]
    return arr.map(priceAsStr => Number(priceAsStr.replace(' €', '').replace(',', '.')))
}

module.exports = {

  _init() {
    I = require('../custom-steps.js')();
  },

  IWaitToLoad() {
    I.waitInUrl('/handytarife/vergleich')
  },

  ISeeHeadline() {
    if (!isMobilePhone) I.see('Handytarife im Vergleich', '.headline')
  },

  ISeeFilterWidget() {
    if (isMobilePhone) {
        I.seeElement('//c24-header-tabs')
    } else {
        I.seeElement('//c24-result-list-filter')
    }
  },

  ISeeHandyTariffs() {
    I.seeElement('c24-result-list-item')
  },

  ISeeNthProvider(providerName, i) {
    const nthOfXPath = (xpath, i) => { xpath: `(${xpath})[${i}]` }

    if (isMobilePhone) {
      I.waitForVisible('.tariff-name')
      I.see(providerName, nthOfXPath('//*[contains(@class, "tariff-name")]', i))
    } else if (isTablet) {
      I.waitForVisible('//c24-result-list-item')
      I.see(providerName, nthOfXPath('//c24-result-list-item', i))
    } else {
      I.waitForVisible('//c24-result-list-tariff-name')
      I.see(providerName, nthOfXPath('//c24-result-list-tariff-name', i))
    }
  },

  ISelectDatenvolumen(datenvolumen) {
    if (isMobilePhone) {
      I.click('ändern', '#EL_CTAAendern')
      I.waitForVisible('#data_included')
      I.selectOption('#data_included', datenvolumen)
      I.click('übernehmen')
    } else {
      I.selectOption('#data_included', datenvolumen)
    }
  },

  async IGrabBestPrice(amountInEuro) {
    if (isMobilePhone) {
        const prices = await I.grabTextFrom('c24-result-list-item:nth-child(1) .price .value')
        const netPrice = toNumber(prices)[2]
        return netPrice
    } else {
        const prices = await I.grabTextFrom('c24-tariff-price-average:nth-child(1) .value')
        const netPrice = toNumber(prices)[0]
        return netPrice
    }
  }
}
