import Maybe from './lib/Maybe';
import fs from 'fs';

function csvParse(csv, reviver) {

    reviver = reviver || function(r, c, v) { return v; };
    const chars = csv.split('');
    const cc = chars.length;
    const table = []
    let c = 0, start, end, row;

    while (c < cc) {

        table.push(row = []);

        while (c < cc && '\r' !== chars[c] && '\n' !== chars[c]) {

            start = end = c;

            if ('"' === chars[c]) {

                start = end = ++c;

                while (c < cc) {

                    if ('"' === chars[c]) {

                        if ('"' !== chars[c+1]) break;
                        else chars[++c] = ''; // unescape ""
                    }
                    end = ++c;
                }

                if ('"' === chars[c]) ++c;

                while (c < cc && '\r' !== chars[c] && '\n' !== chars[c] && ',' !== chars[c])
                    ++c;
            }
            else {

                while (c < cc && '\r' !== chars[c] && '\n' !== chars[c] && ',' !== chars[c])
                    end = ++c;
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

const findSpecies = arr => arr.findIndex( arr => arr[0] === "COM_NAME" );
const findParticipants = arr => arr.findIndex( arr => arr[1] === "FirstName" );
const parseTaxa = str => str.split('[')[0].slice(0, -2);
const findWeather = arr => arr.findIndex(arr => arr[0] === "CountYear5");
const findOrg = arr => arr.findIndex(arr => arr[0] === "CountYear4");

const parseWeatherData = arr =>
    arr.reduce((prev, current) => {

        const [
                cbcYear, lowTemp, highTemp,
                amClouds, pmClouds, amRain,
                pmRain, amSnow, pmSnow
            ] = current.map(val => Maybe.of(val));

        // +1899 to give calendar year, since 1900 was year 1
        prev[cbcYear.emit() + 1899] = {
            cbcYear, lowTemp, highTemp,
            amClouds, pmClouds, amRain,
            pmRain, amSnow, pmSnow
        };

        return prev;
    }, {});

const parseMiscData = arr =>
    arr.reduce((prev, current) => {

        const [
            cbcYear, date,
            participants, totalHours,
            speciesReported] = current.map(val => Maybe.of(val));

        prev[cbcYear.emit() + 1899] = {date, participants, totalHours, speciesReported};

        return prev;
    }, {});

const parseCountYears = arr => {

    const weather = arr.slice(4, findWeather(arr) - 1);
    const misc = arr.slice(findWeather(arr) + 1, findOrg(arr) - 1);
    const weatherData = parseWeatherData(weather);
    const miscData = parseMiscData(misc);

    Object.keys(miscData).forEach(key => {

        Object.assign(miscData[key], weatherData[key]);
    });

    return miscData;
};

const parseSpecies = arr =>
    arr.reduce((prev, current) => {

        // not yet sure why this is necessary
        if (!current[1])
            return prev;

        const countYear = current[1].substring(0, 4);
        const taxa = current[0];
        const count = Maybe.of(current[2]);
        const perHour = Maybe.of(current[3]);
        const flags = current[4] ? Maybe.of(current[4].slice(0, -1).split(',')) : Maybe.of([]);

        if (!prev[countYear])
            prev[countYear] = {};

        prev[countYear][parseTaxa(taxa)] = {count, perHour, flags};

        return prev;
    }, {});

const parseLatitiude = str => str ? Number(str.split('/')[0]) : null;
const parseLongitude = str => str ? Number(str.split('/')[1]) : null;

const parseCircle = arr => ({
    name: Maybe.of(arr[0]),
    code: Maybe.of(arr[1]),
    latitude: Maybe.of(parseLatitiude(arr[2])),
    longitude: Maybe.of(parseLongitude(arr[2]))
});

const processFile = str => {

    const csvFile = fs.readFileSync(str, 'utf-8');
    const rows = csvParse(csvFile);
    const speciesStartIndex = findSpecies(rows) + 1;
    const speciesEndIndex = findParticipants(rows);
    const speciesRows = rows.slice(speciesStartIndex, speciesEndIndex - 1);
    const countYearsRows = rows.slice(0, speciesStartIndex - 1);

    return {
        circle: parseCircle(rows[1]),
        species: parseSpecies(speciesRows),
        countYears: parseCountYears(countYearsRows)
    };
};

export {processFile as default};
