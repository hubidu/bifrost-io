'use strict';
let Helper = codecept_helper;

// use any assertion library you like
const assert = require('assert')
const ElementNotFound = require('codeceptjs/lib/helper/errors/ElementNotFound');
// const Locator = require('codeceptjs/lib/helper/locator');


function assertElementExists(res, locator, prefix, suffix) {
    if (!res) {
        throw new ElementNotFound(locator, prefix, suffix);
    }
}

async function clickVisibleWDIO(wdio, locator, context) {
    assert(wdio, 'clickVisible() requires WebDriverIO')
    let browser = wdio.browser;

    const res = await wdio._locateClickable(locator)
    const elemIsDisplayed = await Promise.all(res.map(elem => browser.elementIdDisplayed(elem.ELEMENT)))

    let visibleClickableElement
    res.forEach((elem, i) => elemIsDisplayed[i].value === true ? visibleClickableElement = elem : false)

    if (context) {
        assertElementExists(visibleClickableElement, locator, 'Clickable element', `was not found inside element ${new Locator(context).toString()}`);
    } else {
        assertElementExists(visibleClickableElement, locator, 'Clickable element');
    }
    return browser.elementIdClick(visibleClickableElement.ELEMENT)
}

async function clickVisiblePP(pp, locator, context) {

}

class CustomHelper extends Helper {
  /**
   * Click the first visible element matching the locator and context
   */
  async clickVisible(locator, context = undefined) {
    const wdio = this.helpers['WebDriver'] || this.helpers['WebDriverIO']
    const pp = this.helpers['Puppeteer']

    if (wdio) return clickVisibleWDIO(wdio, locator, context)
    if (pp) return clickVisiblePP(pp, locator, context)
  }
}

module.exports = CustomHelper;
