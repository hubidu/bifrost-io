const isMobilePhone = process.env.TEST_DEVICE && process.env.TEST_DEVICE.match(/^(iPhone|Pixel).*/)
const isTablet = process.env.TEST_DEVICE && process.env.TEST_DEVICE.indexOf('iPad') >= 0

module.exports = {
  isMobilePhone,
  isTablet
}
