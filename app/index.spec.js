'use strict';

var _index = require('./index');

var _index2 = _interopRequireDefault(_index);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

describe('the cbc-parser', function () {

    it('can read CSV files', function () {

        var csvFile = (0, _index2.default)('src/test.csv');

        expect(csvFile[2008]['Red-breasted Nuthatch'].count).toBe(27);
    });
});