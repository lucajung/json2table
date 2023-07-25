import { ComputedTableItem } from "./types/ComputedTableItem";
import { Config } from "./types/Config";
import { TableItem } from "./types/TableItem";

/**
 * Renders a HTML table based on the provided data and configuration.
 *
 * @param data - An array of TableItem objects representing the data to be rendered in the table.
 * @param config - An optional Config object containing configuration options for rendering the table.
 * @returns The HTMLTableElement representing the rendered table.
 */
export function render(data: Array<TableItem>, config: Config = {}): HTMLTableElement {
    const keys = new Set<string>();

    data.forEach(tableItem => {
        Object.keys(tableItem).forEach(key => keys.add(key));
    });

    let computedData = reformat(data, Array.from(keys));

    if (config.hasOwnProperty('group') && config.group !== undefined) {
        const group = config.group;
        for (let i = 0; i < group.length; i++) {
            const element = group[i];
            groupBy(computedData, element);
        }
    }

    const header: Array<string> = getHeader(computedData);

    return createHTMLTable(computedData, header);
}

/**
 * Gets the header labels for the computed data.
 *
 * @param data - An array of ComputedTableItem objects representing the computed data.
 * @returns An array of strings representing the header labels for the table.
 */
function getHeader(data: Array<ComputedTableItem>): Array<string> {
    const header: Array<string> = [];
    data[0].keys.forEach(key => {
        if (header.indexOf(key) === -1) {
            header.push(key);
        }
    });
    return header;
}

/**
* Creates the HTML table element based on the computed data and header labels.
*
* @param data - An array of ComputedTableItem objects representing the computed data for the table.
* @param keys - An array of strings representing the header labels for the table.
* @returns The HTMLTableElement representing the rendered table.
*/
function createHTMLTable(data: Array<ComputedTableItem>, keys: Array<string>): HTMLTableElement {
    const table = document.createElement('table');
    const thead = document.createElement('thead');
    const tbody = document.createElement('tbody');
    table.appendChild(thead);
    table.appendChild(tbody);

    const tr = document.createElement('tr');
    keys.forEach(key => {
        const th = document.createElement('th');
        th.appendChild(document.createTextNode(key));
        tr.appendChild(th);
    });
    thead.appendChild(tr);

    calculateRowSpan(data).forEach(row => {
        const trBody = document.createElement('tr');
        row.forEach(value => {
            const td = document.createElement('td');
            td.appendChild(document.createTextNode(value.value));
            td.rowSpan = value.rowSpan;
            trBody.appendChild(td);
        });
        tbody.appendChild(trBody);
    });

    return table;
}

/**
 * Reformats the original data into an array of ComputedTableItem objects based on provided keys.
 *
 * @param data - An array of TableItem objects representing the original data.
 * @param keys - An array of strings representing the keys to include in the ComputedTableItem objects.
 * @returns An array of ComputedTableItem objects representing the reformatted data.
 */
function reformat(data: Array<TableItem>, keys: Array<string>): Array<ComputedTableItem> {
    const result: Array<ComputedTableItem> = [];
    data.forEach(tableItem => {
        result.push({
            keys: keys,
            values: keys.map(x => tableItem.hasOwnProperty(x) ? tableItem[x] : ''),
        });
    });
    return result;
}

/**
 * Groups the computed data based on a given key and layer.
 *
 * @param data - An array of ComputedTableItem objects representing the computed data for the table.
 * @param key - The key by which to group the data.
 */
function groupBy(data: Array<ComputedTableItem>, key: string) {
    const index = data[0].keys.indexOf(key);
    const prev_index = index - 1;
    const sortingIntervals: Array<[number, number]> = [];
    let start = 0;
    let currentItem: null | string = null;
    if (prev_index >= 0) {
        data.forEach((computedTableItem, i) => {
            if (currentItem == null) {
                currentItem = computedTableItem.values[prev_index];
            }
            else if (currentItem !== computedTableItem.values[prev_index]) {
                sortingIntervals.push([start, i]);
                start = i + 1;
                currentItem = computedTableItem.values[prev_index];
            }
        });
    }
    else {
        sortingIntervals.push([0, data.length]);
    }
    sortingIntervals.forEach(interval => {
        data = data.slice(interval[0], interval[1]).sort((a, b) => {
            const first = a.values[index].toLowerCase();
            const second = b.values[index].toLowerCase();
            return (first < second) ? -1 : (first > second) ? 1 : 0;
        }).concat(data.slice(interval[1], data.length));
    });
}

function calculateRowSpan(data: Array<ComputedTableItem>): Array<Array<{value: string, rowSpan: number}>>{
    const result: Array<Array<{value: string, rowSpan: number}>> = data[0].keys.map(x => []);

    for (let i = 0; i < data[0].keys.length; i++) {
        let lastValue = data[data.length - 1].values[i];
        let rowSpan = 1;
        for (let k = data.length - 1; k >= 0; k--) {
            const element = data[k];
            if(element.values[i] !== lastValue || k === 0){
                result[i].push({value: element.values[i], rowSpan: rowSpan});
                rowSpan = 1;
            }
            else {
                result[i].push({value: element.values[i], rowSpan: 1});
                rowSpan++;
            }
        }
    }

    return result;
}