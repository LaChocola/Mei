"use strict";

const app = jest.genMockFromModule("apiai");

var request = {
    on: jest.fn().mockName("on").mockImplementation(function(event, fn) {
        if (event === "response") {
            fn("RESPONSE");
        }
    }),
    end: jest.fn().mockName("end")
};

app.mockReturnValue({
    textRequest: jest.fn().mockName("textRequest").mockReturnValue(request)
});

module.exports = app;
