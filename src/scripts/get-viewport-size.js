module.exports = function() {
    return {
        width: Math.max(document.documentElement.clientWidth, window.innerWidth || 0),
        height: Math.max(document.documentElement.clientHeight, window.innerHeight || 0)    
    }
}