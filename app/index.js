'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = undefined;

var _Maybe = require('./lib/Maybe');

var _Maybe2 = _interopRequireDefault(_Maybe);

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var memoize = function memoize(fn) {

    var cache = {};
    return function () {
        for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
        }

        var stringifiedArgs = JSON.stringify(args);
        var result = cache[stringifiedArgs] = cache[stringifiedArgs] || fn.apply(undefined, args);
        return result;
    };
};

var CSV = {
    parse: function parse(csv, reviver) {
        reviver = reviver || function (r, c, v) {
            return v;
        };
        var chars = csv.split(''),
            c = 0,
            cc = chars.length,
            start,
            end,
            table = [],
            row;
        while (c < cc) {
            table.push(row = []);
            while (c < cc && '\r' !== chars[c] && '\n' !== chars[c]) {
                start = end = c;
                if ('"' === chars[c]) {
                    start = end = ++c;
                    while (c < cc) {
                        if ('"' === chars[c]) {
                            if ('"' !== chars[c + 1]) {
                                break;
                            } else {
                                chars[++c] = '';
                            } // unescape ""
                        }
                        end = ++c;
                    }
                    if ('"' === chars[c]) {
                        ++c;
                    }
                    while (c < cc && '\r' !== chars[c] && '\n' !== chars[c] && ',' !== chars[c]) {
                        ++c;
                    }
                } else {
                    while (c < cc && '\r' !== chars[c] && '\n' !== chars[c] && ',' !== chars[c]) {
                        end = ++c;
                    }
                }
                end = reviver(table.length - 1, row.length, chars.slice(start, end).join(''));
                row.push(isNaN(end) ? end : +end);
                if (',' === chars[c]) {
                    ++c;
                }
            }
            if ('\r' === chars[c]) {
                ++c;
            }
            if ('\n' === chars[c]) {
                ++c;
            }
        }
        return table;
    },

    stringify: function stringify(table, replacer) {
        replacer = replacer || function (r, c, v) {
            return v;
        };
        var csv = '',
            c,
            cc,
            r,
            rr = table.length,
            cell;
        for (r = 0; r < rr; ++r) {
            if (r) {
                csv += '\r\n';
            }
            for (c = 0, cc = table[r].length; c < cc; ++c) {
                if (c) {
                    csv += ',';
                }
                cell = replacer(r, c, table[r][c]);
                if (/[,\r\n"]/.test(cell)) {
                    cell = '"' + cell.replace(/"/g, '""') + '"';
                }
                csv += cell || 0 === cell ? cell : '';
            }
        }
        return csv;
    }
};

function findSpecies(arr) {

    return arr.findIndex(function (arr) {

        return arr[0] === "COM_NAME";
    });
}

function findParticipants(arr) {

    return arr.findIndex(function (arr) {

        return arr[1] === "FirstName";
    });
}

function parseTaxa(str) {

    return str.split('[')[0].slice(0, -2);
}

function parseSpecies(arr) {

    return arr.reduce(function (prev, current) {

        // not sure why necessary
        if (!current[1]) return prev;

        var countYear = current[1].substring(0, 4);
        var taxa = current[0];
        var count = current[2];
        var hours = current[3];

        if (!prev[countYear]) prev[countYear] = {};

        prev[countYear][parseTaxa(taxa)] = { count: count, hours: hours };

        return prev;
    }, {});
}

function processFile(str) {

    var csvFile = _fs2.default.readFileSync(str, 'utf-8');
    var rows = CSV.parse(csvFile);
    var speciesStartIndex = findSpecies(rows);
    var speciesEndIndex = findParticipants(rows);

    return parseSpecies(rows.splice(speciesStartIndex + 1, speciesEndIndex - speciesStartIndex - 1));
}

exports.default = processFile;