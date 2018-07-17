module.exports = function() {
  if (window.performance) {
    return window.performance.getEntries();
  }
}