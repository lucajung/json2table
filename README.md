# @lucajung/json2table

[![npm version](https://badge.fury.io/js/@lucajung%2Fjson2table.svg)](https://badge.fury.io/js/@lucajung%2Fjson2table)
[![License](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)

## Description

@lucajung/json2table is a utility library for rendering data as HTML tables with customizable grouping. It provides a simple API to convert arrays of data into HTML table elements with grouped rows based on specific keys.


## Installation

You can install the package using npm:

```bash
npm install @lucajung/json2table
```

## Usage

```javascript
import { render } from '@lucajung/json2table';
// or, if using CommonJS
// const { render } = require('@lucajung/json2table');

// Sample data
const data = [
  { Name: 'John Doe', Age: 30, Country: 'USA' },
  { Name: 'Jane Smith', Age: 25, Country: 'Canada' },
  { Name: 'Michael Johnson', Age: 28, Country: 'USA' },
  { Name: 'Emily Brown', Age: 22, Country: 'Canada' },
  { Name: 'David Lee', Age: 32, Country: 'Australia' },
  { Name: 'Sophia Chen', Age: 27, Country: 'Australia' },
  { Name: 'James Kim', Age: 31, Country: 'USA' },
  { Name: 'Isabella Wang', Age: 29, Country: 'Canada' },
  { Name: 'Oliver Wong', Age: 24, Country: 'Canada' },
  { Name: 'Emma Liu', Age: 26, Country: 'Australia' },
  // Add more data items here
];


// Optional configuration
const config = {
  group: ['Country'], // Array of keys to group the data by
  tableClass: 'bold-table'
};

// Render the data as an HTML table
const tableElement = render(data, config);

// Append the table to an HTML element
document.getElementById('table-container').appendChild(tableElement);
```

## Features

- Render data as HTML tables.
- Customize table grouping.
- Support for rowspan calculations in the rendered table.
- Easy-to-use and well-documented API.

## Demo
Take a look at the [Demo](https://lucajung.github.io/json2table/)

## API

### render(data, config)

`render` is the main function to convert data into an HTML table.

**Parameters:**

- `data` (Array<TableItem>): An array of objects, where each object represents a row in the table.
- `config` (Config) [Optional]: An optional configuration object for customizing the rendering. It supports the following properties:
  - `group` (Array<string>): An array of keys by which to group the table rows.
  - `tableClass` (string): Specifies the name of the table class

**Returns:**

- `HTMLTableElement`: The HTMLTableElement representing the rendered table.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Contributions

Contributions to this project are welcome. To submit a bug report, feature request please use GitHub Issues.