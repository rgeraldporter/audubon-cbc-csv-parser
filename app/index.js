'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = undefined;

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _Maybe = require('./lib/Maybe');

var _Maybe2 = _interopRequireDefault(_Maybe);

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function csvParse(csv, reviver) {

    reviver = reviver || function (r, c, v) {
        return v;
    };
    var chars = csv.split('');
    var cc = chars.length;
    var table = [];
    var c = 0,
        start = void 0,
        end = void 0,
        row = void 0;

    while (c < cc) {

        table.push(row = []);

        while (c < cc && '\r' !== chars[c] && '\n' !== chars[c]) {

            start = end = c;

            if ('"' === chars[c]) {

                start = end = ++c;

                while (c < cc) {

                    if ('"' === chars[c]) {

                        if ('"' !== chars[c + 1]) break;else chars[++c] = ''; // unescape ""
                    }
                    end = ++c;
                }

                if ('"' === chars[c]) ++c;

                while (c < cc && '\r' !== chars[c] && '\n' !== chars[c] && ',' !== chars[c]) {
                    ++c;
                }
            } else {

                while (c < cc && '\r' !== chars[c] && '\n' !== chars[c] && ',' !== chars[c]) {
                    end = ++c;
                }
            }

            end = reviver(table.length - 1, row.length, chars.slice(start, end).join(''));
            row.push(isNaN(end) ? end : Number(end));

            if (',' === chars[c]) ++c;
        }

        if ('\r' === chars[c]) ++c;

        if ('\n' === chars[c]) ++c;
    }

    return table;
}

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

function findWeather(arr) {

    return arr.findIndex(function (arr) {

        return arr[0] === "CountYear5";
    });
}

function findOrg(arr) {

    return arr.findIndex(function (arr) {

        return arr[0] === "CountYear4";
    });
}

function parseWeatherData(arr) {

    return arr.reduce(function (prev, current) {
        var _current$map = current.map(function (val) {
            return _Maybe2.default.of(val);
        });

        var _current$map2 = _slicedToArray(_current$map, 9);

        var cbcYear = _current$map2[0];
        var lowTemp = _current$map2[1];
        var highTemp = _current$map2[2];
        var amClouds = _current$map2[3];
        var pmClouds = _current$map2[4];
        var amRain = _current$map2[5];
        var pmRain = _current$map2[6];
        var amSnow = _current$map2[7];
        var pmSnow = _current$map2[8];

        // +1899 to give calendar year, since 1900 was year 1

        prev[cbcYear.emit() + 1899] = {
            cbcYear: cbcYear, lowTemp: lowTemp, highTemp: highTemp,
            amClouds: amClouds, pmClouds: pmClouds, amRain: amRain,
            pmRain: pmRain, amSnow: amSnow, pmSnow: pmSnow
        };

        return prev;
    }, {});
}

function parseMiscData(arr) {

    return arr.reduce(function (prev, current) {
        var _current$map3 = current.map(function (val) {
            return _Maybe2.default.of(val);
        });

        var _current$map4 = _slicedToArray(_current$map3, 5);

        var cbcYear = _current$map4[0];
        var date = _current$map4[1];
        var participants = _current$map4[2];
        var totalHours = _current$map4[3];
        var speciesReported = _current$map4[4];


        prev[cbcYear.emit() + 1899] = { date: date, participants: participants, totalHours: totalHours, speciesReported: speciesReported };

        return prev;
    }, {});
}

function parseCountYears(arr) {

    var weather = arr.slice(4, findWeather(arr) - 1);
    var misc = arr.slice(findWeather(arr) + 1, findOrg(arr) - 1);
    var weatherData = parseWeatherData(weather);
    var miscData = parseMiscData(misc);

    Object.keys(miscData).forEach(function (key) {

        Object.assign(miscData[key], weatherData[key]);
    });

    return miscData;
}

function parseSpecies(arr) {

    return arr.reduce(function (prev, current) {

        // not yet sure why this is necessary
        if (!current[1]) return prev;

        var countYear = current[1].substring(0, 4);
        var taxa = current[0];
        var count = _Maybe2.default.of(current[2]);
        var perHour = _Maybe2.default.of(current[3]);
        var flags = current[4] ? _Maybe2.default.of(current[4].slice(0, -1).split(',')) : _Maybe2.default.of([]);

        if (!prev[countYear]) prev[countYear] = {};

        prev[countYear][parseTaxa(taxa)] = { count: count, perHour: perHour, flags: flags };

        return prev;
    }, {});
}

function parseLatitiude(str) {

    return str ? Number(str.split('/')[0]) : null;
}

function parseLongitude(str) {

    return str ? Number(str.split('/')[1]) : null;
}

function parseCircle(arr) {

    return {
        name: _Maybe2.default.of(arr[0]),
        code: _Maybe2.default.of(arr[1]),
        latitude: _Maybe2.default.of(parseLatitiude(arr[2])),
        longitude: _Maybe2.default.of(parseLongitude(arr[2]))
    };
}

function processFile(str) {

    var csvFile = _fs2.default.readFileSync(str, 'utf-8');
    var rows = csvParse(csvFile);
    var speciesStartIndex = findSpecies(rows) + 1;
    var speciesEndIndex = findParticipants(rows);
    var speciesRows = rows.slice(speciesStartIndex, speciesEndIndex - speciesStartIndex);
    var countYearsRows = rows.slice(0, speciesStartIndex - 1);

    return {
        circle: parseCircle(rows[1]),
        species: parseSpecies(speciesRows),
        countYears: parseCountYears(countYearsRows)
    };
}

exports.default = processFile;