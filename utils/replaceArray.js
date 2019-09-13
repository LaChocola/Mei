"use strict";

function replaceArray(src, dst) {
    dst.splice(0, dst.length, ...src);
}

module.exports = replaceArray;
