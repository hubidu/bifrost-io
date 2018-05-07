
module.exports = function (sel, isError) {
    isError = isError || false
    var highlightColor = isError ? 'Orange' : 'Teal';


    if (!sel) {
        return new Error('Element selector must be given')
    }

    function querySel(cssOrXPath) {
        function isCss(str) {
            return str.indexOf('.') === 0 || str.indexOf('#') === 0 || str.indexOf('div') === 0 || str.indexOf('[') === 0
        }
        function isXPath(str) {
            return str.indexOf('//') === 0 || str.indexOf('text()') >= 0
        }

        if(isCss(cssOrXPath)) {
            return document.querySelectorAll(sel)
        } else if (isXPath(cssOrXPath)) {
            // TODO Implement this
            // return document.evaluate(cssOrXPath, document, null, XPathResult.ANY_TYPE, null )  
            return undefined
        } else {
            return undefined
        }
    }

    var elems = querySel(sel)
    if (!elems) return

    // Remove previous highlight
    var oldOutlines = document.querySelectorAll('.wdio-outline')
    for (oldOutline of oldOutlines) {
        oldOutline.remove()
    }


    for (el of elems) {
        var rect = el.getBoundingClientRect()

        var newOutline = document.createElement('div')
        newOutline.className = 'wdio-outline'
        newOutline.style.position = 'absolute'
        newOutline.style['color'] = 'white';
        newOutline.style['border-radius'] = '5px';
        newOutline.style.border = `2px solid ${highlightColor}`
        newOutline.style['font-size'] = '10px';
        newOutline.style['padding'] = '1px';
        newOutline.style['z-index'] = '1000';
        newOutline.style['pointer-events'] = 'none'; // be able to click through this element
        newOutline.style.opacity = 0.5;
        newOutline.style['background-color'] = highlightColor;
    
        newOutline.style.width = rect.width + 'px'
        newOutline.style.height = rect.height + 'px'
        newOutline.style.top = rect.top + window.scrollY + 'px'
        newOutline.style.left = rect.left + window.scrollX + 'px'
    
        document.querySelector('body').appendChild(newOutline)
    }
    return true
}
