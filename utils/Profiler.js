"use strict";

const fs = require("fs");

var timestampPath = "db/timestamps.txt";


function getTime() {
    var [secs, ns] = process.hrtime();
    var ms = (secs * 1000) + Math.round(ns / 1000000);
    return ms;
}

class Profiler {
    constructor() {
        this.timestamps = [];
    }

    get start() {
        if (this.timestamps.length === 0) {
            return undefined;
        }
        return this.timestamps[0].time;
    }

    get end() {
        if (this.timestamps.length === 0) {
            return undefined;
        }
        return this.timestamps[this.timestamps.length - 1].time;
    }

    get elapsed() {
        if (!(this.end && this.start)) {
            return 0;
        }
        return this.end - this.start;
    }

    calcDiffs() {
        if (this.timestamps.length === 0) {
            return [];
        }
        var before = this.timestamps.slice(0, -1);
        var after = this.timestamps.slice(1, 0);
        var pairs = before.map(function(b, i) {
            var a = after[i];
            return a.time - b.time;
        });
        return pairs;
    }

    toString() {
        var diffs = this.calcDiffs();
        return `${this.elapsed}ms | ${diffs.join(" , ")}`;
    }

    // Supports optional labels for future expansion
    mark(label) {
        this.timestamps.push({
            label: label || String(this.timestamps.length + 1),    
            time: getTime()
        });
    }

    save() {
        fs.appendFileSync(timestampPath, this.toString() + "\n");
    }
}

module.exports = Profiler;
