
module.exports = function (sel, isError) {
    isError = isError || false
    var highlightColor = isError ? 'Orange' : 'Teal';


    if (!sel) {
        return new Error('Element selector must be given')
    }

    var elems = document.querySelectorAll(sel)

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
        newOutline.style.top = rect.top + 'px'
        newOutline.style.left = rect.left + 'px'
    
        document.querySelector('body').appendChild(newOutline)
    }
    return true
}
