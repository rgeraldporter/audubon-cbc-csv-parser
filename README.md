# Parser for Audubon CBC CSV Files (audubon-cbc-csv-parser)
####v0.1.2

A Node.js module for parsing [Audubon's Christmas Bird Count CSV files](http://netapp.audubon.org/CBCObservation/).

[![Build Status](https://travis-ci.org/rgeraldporter/audubon-cbc-csv-parser.svg?branch=master)](https://travis-ci.org/rgeraldporter/audubon-cbc-csv-parser)

## Purpose

To make the Audubon CBC data more easily accessible by providing a JavaScript API more amenible to data analysis and interaction than the currently available CSV or XLS files.

**Note:** If you are just looking to convert Audubon's CSV files to a better format, you should be using the [CLI Tools for the Audubon CBC](https://github.com/rgeraldporter/audubon-cbc-cli).

## Setup

```
npm install audubon-cbc-csv-parser
```

## Example Usage

```
import cbcParse from 'audubon-cbc-csv-parser';
const csvFile = cbcParse('src/test.csv');
```

## Additional Terms of Use

Please make note of [Audubon's Terms of Use for CBC Data](http://www.audubon.org/content/policy-regarding-use-christmas-bird-count-data) when downloading and using CBC data. It is not provided as true "Open Data" as there are conditions you must adhere to when making use of the data for non-personal use.

## Copyrights & Notices

The Christmas Bird Count (CBC) is a Registered Trademark of the National Audubon Society. CBC Data is provided by National Audubon Society and through the generous efforts of Bird Studies Canada and countless volunteers across the western hemisphere.

## License

The MIT License (MIT)

Copyright (c) 2016 Robert Gerald Porter

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
