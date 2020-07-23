"use strict";

const keyworddb = require("./keyworddb");
const ids = require("./ids");

test("keyworddb", async function() {
    var keywords = await keyworddb.load();
    keywords["a"] = 1;
    await keyworddb.save(keywords);
    expect(keywords).toEqual({ "checksum": ids.users.chocola, "a": 1 });

    var keywords_two = keyworddb.get();
    expect(keywords_two).toEqual({ "checksum": ids.users.chocola, "a": 1 });

    keywords_two["b"] = 2;
    await keyworddb.save(keywords);
    expect(keywords).toEqual({ "checksum": ids.users.chocola, "a": 1, "b": 2 });
    expect(keywords_two).toEqual({ "checksum": ids.users.chocola, "a": 1, "b": 2 });

    var keywords_three = await keyworddb.load();
    expect(keywords_three).toEqual({ "checksum": ids.users.chocola, "a": 1, "b": 2 });
});
