"use strict";

const Jimp = jest.genMockFromModule("jimp");

Jimp.prototype.resize.mockReturnThis();
Jimp.prototype.clone.mockReturnThis();
Jimp.prototype.blit.mockReturnThis();
Jimp.prototype.print.mockReturnThis();
Jimp.prototype.getBufferAsync = jest.fn().mockName("getBufferAsync").mockResolvedValue("BUFFER");  // Why isn't this automocked?
var image = new Jimp();

var font = {};

Jimp.read.mockResolvedValue(image);
Jimp.loadFont.mockResolvedValue(font);

module.exports = Jimp;
