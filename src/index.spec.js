import cbcParse from './index';

describe('the cbc-parser', () => {

    it('can read CSV files', () => {

        const csvFile = cbcParse('src/test.csv');

        expect(csvFile[2008]['Red-breasted Nuthatch'].count).toBe(27);
    });
});