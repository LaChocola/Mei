"use strict";

// Copies a getter from one class to another
function copyGetter(src, dst, prop) {
    var propDesc = Object.getOwnPropertyDescriptor(src.prototype, prop);
    Object.defineProperty(dst.prototype, prop, propDesc);
}

module.exports = copyGetter;
