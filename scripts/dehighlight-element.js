
module.exports = function () {
    // Remove previous highlight
    var oldOutlines = document.querySelectorAll('.wdio-outline')
    for (oldOutline of oldOutlines) {
        oldOutline.remove()
    }

    return true
}
