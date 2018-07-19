module.exports = function() {
  if (window.performance) {
    return  JSON.stringify(window.performance.getEntries());
  }
}