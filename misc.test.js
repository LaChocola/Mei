"use strict";

const misc = require("./misc");

test("timestampToSnowflake", async function() {
    var t;
    var s;

    t = 1588037318713;
    s = misc.timestampToSnowflake(t);
    expect(s).toBe(704504319025610752);

    t = 1546318800000;
    s = misc.timestampToSnowflake(t);
    expect(s).toBe(529524169113600000);

    t = 1529771696000;
    s = misc.timestampToSnowflake(t);
    expect(s).toBe(460120584617984000);
});

test("leftShift", async function() {
    var n;

    n = misc.leftShift(1, 1);
    expect(n).toBe(2);

    n = misc.leftShift(1, 2);
    expect(n).toBe(4);

    n = misc.leftShift(1, 10);
    expect(n).toBe(1024);

    n = misc.leftShift(1, 20);
    expect(n).toBe(1048576);

    n = misc.leftShift(1, 22);
    expect(n).toBe(4194304);

    n = misc.leftShift(1, 32);
    expect(n).toBe(4294967296);
});
