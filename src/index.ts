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
            groupBy(computedData, element, i);
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
    if (data[0].childs !== undefined && data[0].childs.length > 0) {
        header.push(...getHeader(data[0].childs));
    }
    return header;
}

/**
 * Creates an array of value arrays for a ComputedTableItem, considering rowspan values for child elements.
 *
 * @param data - The ComputedTableItem for which to create the value arrays.
 * @returns An array of arrays containing value and rowspan information for each table cell.
 */
function createValueArraysByTableItem(data: ComputedTableItem): Array<Array<{ value: string, rowspan: number }>> {
    const result: Array<Array<{ value: string, rowspan: number }>> = [];
    const row: Array<{ value: string, rowspan: number }> = data.values.map(x => { return { value: x, rowspan: countLeafElements(data) } });
    if (data.childs !== undefined && data.childs.length > 0) {
        data.childs?.forEach(child => {
            createValueArraysByTableItem(child).forEach(childRow => {
                result.push([...row, ...childRow]);
            });
        });
    }
    else {
        result.push(row);
    }
    return result;
}

/**
 * Counts the number of leaf elements (elements without children) in a ComputedTableItem.
 *
 * @param data - The ComputedTableItem for which to count the leaf elements.
 * @returns The number of leaf elements in the ComputedTableItem.
 */
function countLeafElements(data: ComputedTableItem): number {
    let count = 0;

    if (data.hasOwnProperty('childs') && data.childs !== undefined) {
        data.childs.forEach(child => {
            count += countLeafElements(child);
        });
    }
    else {
        count = 1;
    }

    return count;
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

    data.forEach(computedTableItem => {
        tbody.append(...createHTMLTableRows(computedTableItem));
    });

    return table;
}

/**
 * Creates an array of HTML table rows for a given ComputedTableItem.
 *
 * @param computedTableItem - The ComputedTableItem for which to create the table rows.
 * @returns An array of HTMLTableRowElement objects representing the table rows.
 */
function createHTMLTableRows(computedTableItem: ComputedTableItem): Array<HTMLTableRowElement> {
    const rows: Array<HTMLTableRowElement> = [];
    const rowspanCounter = new Map<string, number>();

    createValueArraysByTableItem(computedTableItem).forEach(valueArray => {
        const tr = document.createElement('tr');
        valueArray.forEach(value => {
            const td = document.createElement('td');
            td.appendChild(document.createTextNode(value.value));
            let addRow = true;
            if (rowspanCounter.has(value.value)) {
                if (rowspanCounter.get(value.value)! === 1) {
                    addRow = true;
                }
                else {
                    rowspanCounter.set(value.value, rowspanCounter.get(value.value)! - 1);
                    addRow = false;
                }
            }
            else {
                rowspanCounter.set(value.value, value.rowspan);
                addRow = true;
            }
            if (addRow) {
                td.rowSpan = value.rowspan;
                tr.appendChild(td);
            }
        });
        rows.push(tr);
    });
    return rows;
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
 * @param layer - The layer at which to perform the grouping.
 */
function groupBy(data: Array<ComputedTableItem>, key: string, layer: number) {
    callFunctionOnChilds(data, key, groupingHelper, 0, layer);
}

/**
 * Calls a custom function on child elements at a specified destination layer.
 *
 * @param data - An array of ComputedTableItem objects representing the computed data for the table.
 * @param key - The key by which to group the data (if applicable).
 * @param customFunction - The custom function to be called on the child elements.
 * @param currentLayer - The current layer of the data being processed.
 * @param destinationLayer - The layer at which to perform the custom function.
 */
function callFunctionOnChilds(data: Array<ComputedTableItem>, key: string, customFunction: (data: Array<ComputedTableItem>, key: string) => Array<ComputedTableItem>, currentLayer: number, destinationLayer: number) {
    if (currentLayer === destinationLayer) {
        const tmp = customFunction(data, key);
        Object.assign(data, tmp, { length: tmp.length });
    }
    else {
        data.forEach(computedTableItem => {
            if (computedTableItem.childs !== undefined) {
                callFunctionOnChilds(computedTableItem.childs, key, customFunction, currentLayer + 1, destinationLayer);
            }
        });
    }
}

/**
 * Helper function for grouping data based on a specific key.
 *
 * @param data - An array of ComputedTableItem objects representing the computed data for the table.
 * @param key - The key by which to group the data.
 * @returns An array of ComputedTableItem objects representing the grouped data.
 */
function groupingHelper(data: Array<ComputedTableItem>, key: string): Array<ComputedTableItem> {
    const index = data[0].keys.findIndex(x => x === key);
    const map = new Map<string, Array<ComputedTableItem>>();
    const result: Array<ComputedTableItem> = [];
    data.forEach(computedTableItem => {
        const value = computedTableItem.values[index];
        if (map.has(value)) {
            map.get(value)?.push(computedTableItem);
        } else {
            map.set(value, [computedTableItem]);
        }
    });

    map.forEach((value, key) => {
        result.push(groupingHelperSingleItem(value, index));
    });

    return result;
}

/**
 * Helper function for grouping data based on a specific key (for a single ComputedTableItem).
 *
 * @param data - An array of ComputedTableItem objects representing the computed data for the table.
 * @param index - The index of the key by which to group the data.
 * @returns A ComputedTableItem object representing the grouped data.
 */
function groupingHelperSingleItem(data: Array<ComputedTableItem>, index: number): ComputedTableItem {
    const result: ComputedTableItem = {
        keys: [data[0].keys[index]],
        values: [data[0].values[index]],
        childs: [],
    };
    data.forEach(computedTableItem => {
        const keys = [...computedTableItem.keys];
        const values = [...computedTableItem.values];
        keys.splice(index, 1);
        values.splice(index, 1)
        result.childs?.push({
            keys: keys,
            values: values,
        });
    });
    return result;
}