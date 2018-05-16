
module.exports = function (sel, isError, txt) {
    isError = isError || false
    var highlightColor = isError ? 'Orange' : 'Teal';


    if (!sel) {
        return new Error('Element selector must be given')
    }

    function querySel(cssOrXPath) {
        const isCss = (str) => ['.', '#', '[', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'span', 'div'].some(el => str.indexOf(el) === 0)
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
        newOutline.style['padding'] = '1px';
        newOutline.style['z-index'] = '1000';
        newOutline.style['pointer-events'] = 'none'; // be able to click through this element
        newOutline.style.opacity = 0.5;
        newOutline.style['background-color'] = highlightColor
    
        newOutline.style.width = rect.width + 'px'
        newOutline.style.height = rect.height + 'px'
        newOutline.style.top = rect.top + window.scrollY + 'px'
        newOutline.style.left = rect.left + window.scrollX + 'px'
        
        if (txt) {
            var txtContainer = document.createElement('div')
            var textContent = document.createTextNode(txt); 
            txtContainer.className = 'wdio-outline'
            txtContainer.style.position = 'absolute'
            txtContainer.style['padding'] = '3px';
            txtContainer.style['border-radius'] = '3px';
            txtContainer.style['color'] = 'white'
            txtContainer.style['background-color'] = highlightColor
            txtContainer.style['font-size'] = '10px';
            txtContainer.style['z-index'] = '1000';
            txtContainer.style['pointer-events'] = 'none'; // be able to click through this element
            txtContainer.style.opacity = 0.8;

            txtContainer.style.width = '250px'
            txtContainer.style.height = '40px'
            txtContainer.style.top = (rect.top + window.scrollY - 50) + 'px'
            txtContainer.style.left = (rect.left + window.scrollX) + 'px'
                        
            txtContainer.appendChild(textContent);      
            document.querySelector('body').appendChild(txtContainer)
        }

        document.querySelector('body').appendChild(newOutline)
    }
    return true
}
