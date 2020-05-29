"use strict";

const misc = jest.genMockFromModule("../misc");
const orig = jest.requireActual("../misc");

// Mock function that use randomness with consistent results
misc.choose.mockImplementation(function(arr) {
    return arr[0];
});
misc.chooseHand.mockReturnValue(":ok_hand::skin-tone-5:");

// Disable delay for speed
misc.delay.mockResolvedValue();

// Keep the original module, but override the mocked functions
module.exports = {
    ...orig,
    choose: misc.choose,
    chooseHand: misc.chooseHand,
    delay: misc.delay
};
