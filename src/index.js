import Maybe from './lib/Maybe';
import fs from 'fs';

const memoize = fn => {

    const cache = {};
    return (...args) => {
        const stringifiedArgs = JSON.stringify(args);
        const result = cache[stringifiedArgs] = cache[stringifiedArgs] || fn(...args);
        return result;
    };
};


const CSV = {
    parse: function(csv, reviver) {
        reviver = reviver || function(r, c, v) { return v; };
        var chars = csv.split(''), c = 0, cc = chars.length, start, end, table = [], row;
        while (c < cc) {
            table.push(row = []);
            while (c < cc && '\r' !== chars[c] && '\n' !== chars[c]) {
                start = end = c;
                if ('"' === chars[c]){
                    start = end = ++c;
                    while (c < cc) {
                        if ('"' === chars[c]) {
                            if ('"' !== chars[c+1]) { break; }
                            else { chars[++c] = ''; } // unescape ""
                        }
                        end = ++c;
                    }
                    if ('"' === chars[c]) { ++c; }
                    while (c < cc && '\r' !== chars[c] && '\n' !== chars[c] && ',' !== chars[c]) { ++c; }
                } else {
                    while (c < cc && '\r' !== chars[c] && '\n' !== chars[c] && ',' !== chars[c]) { end = ++c; }
                }
                end = reviver(table.length-1, row.length, chars.slice(start, end).join(''));
                row.push(isNaN(end) ? end : +end);
                if (',' === chars[c]) { ++c; }
            }
            if ('\r' === chars[c]) { ++c; }
            if ('\n' === chars[c]) { ++c; }
        }
        return table;
    },

    stringify: function(table, replacer) {
        replacer = replacer || function(r, c, v) { return v; };
        var csv = '', c, cc, r, rr = table.length, cell;
        for (r = 0; r < rr; ++r) {
            if (r) { csv += '\r\n'; }
            for (c = 0, cc = table[r].length; c < cc; ++c) {
                if (c) { csv += ','; }
                cell = replacer(r, c, table[r][c]);
                if (/[,\r\n"]/.test(cell)) { cell = '"' + cell.replace(/"/g, '""') + '"'; }
                csv += (cell || 0 === cell) ? cell : '';
            }
        }
        return csv;
    }
};

function findSpecies(arr) {

    return arr.findIndex((arr) => {

        return arr[0] === "COM_NAME";
    });
}

function findParticipants(arr) {

    return arr.findIndex((arr) => {

        return arr[1] === "FirstName";
    });
}

function parseTaxa(str) {

    return str.split('[')[0].slice(0, -2);
}

function parseSpecies(arr) {

    return arr.reduce((prev, current) => {

        // not sure why necessary
        if (!current[1])
            return prev;

        const countYear = current[1].substring(0, 4);
        const taxa = current[0];
        const count = current[2];
        const hours = current[3];

        if (!prev[countYear])
            prev[countYear] = {};

        prev[countYear][parseTaxa(taxa)] = {count, hours};

        return prev;
    }, {});
}

function processFile(str) {

    const csvFile = fs.readFileSync(str, 'utf-8');
    const rows = CSV.parse(csvFile);
    const speciesStartIndex = findSpecies(rows);
    const speciesEndIndex = findParticipants(rows);

    return parseSpecies(rows.splice(speciesStartIndex + 1, speciesEndIndex - speciesStartIndex - 1));
}

export {processFile as default};
