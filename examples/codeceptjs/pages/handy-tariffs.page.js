'use strict';
let I;

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
    if (process.env.TEST_DEVICE !== 'mobile') I.see('Handytarife im Vergleich', '.headline')
  },

  ISeeFilterWidget() {
    if (process.env.TEST_DEVICE === 'mobile') {
        I.seeElement('//c24-header-tabs')
    } else {
        I.seeElement('//c24-result-list-filter')
    }
  },

  ISeeHandyTariffs() {
    I.seeElement('c24-result-list-item')
  },

  ISeeNthProvider(providerName, i) {
    I.see(providerName, { xpath: `(//c24-result-list-tariff-name)[${i}]` })
  },

  async IGrabBestPrice(amountInEuro) {
    if (process.env.TEST_DEVICE === 'mobile') {
        const prices = await I.grabTextFrom('c24-result-list-item:nth-child(1) .price .value')
        const netPrice = toNumber(prices)[2]
        return netPrice
    } else {
        const prices = await I.grabTextFrom('c24-result-list-tariff-name:nth-child(1) c24-tariff-price-average .value')
        const netPrice = toNumber(prices)[0]
        return netPrice
    }
  }
}
