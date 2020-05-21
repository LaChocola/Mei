"use strict";

const request = jest.genMockFromModule("request-promise");

var cookieJar = {
    setCookie: jest.fn().mockName("setCookie"),
    getCookieString : jest.fn().mockName("getCookieString"),
    getCookies : jest.fn().mockName("getCookies")
};
request.jar.mockReturnValue(cookieJar);

request.defaults.mockReturnThis();

module.exports = request;
