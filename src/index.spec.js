import cbcParse from './index';

describe('the cbc-parser', () => {

    it('can read CSV files', () => {

        const csvFile = cbcParse('src/test.csv');

        expect(csvFile.species[2008]['Red-breasted Nuthatch'].count.emit()).toBe(27);
        expect(csvFile.species[2008]['Red-breasted Nuthatch'].flags.emit().length).toBe(0);
        expect(csvFile.species[2014]['American Coot'].flags.emit()[0]).toBe('HC');
        expect(csvFile.species[2012]['duck sp.'].count.emit()).toBe(1023);
        expect(csvFile.species[2009]['Blue Jay'].perHour.emit()).toBe(1.8247);
        expect(csvFile.species[2013]['Winter Wren'].count.emit()).toBe(25);

        expect(csvFile.countYears[2008].date.emit()).toBe('12/26/2008');
        expect(csvFile.countYears[2008].participants.emit()).toBe(81);
        expect(csvFile.countYears[2008].speciesReported.emit()).toBe(104);
        expect(csvFile.countYears[2008].totalHours.emit()).toBe(227);
        expect(csvFile.countYears[2010].totalHours.emit()).toBe(226.25);

        expect(csvFile.circle.name.emit()).toBe('Hamilton');
        expect(csvFile.circle.latitude.emit()).toBe(43.267879);
        expect(csvFile.circle.longitude.emit()).toBe(-79.885232);
    });
});