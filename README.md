# json2table
An NPM repository for quick and easy formatting of JSON data as HTML tables.

```json
[
    {
        "Item": "Fork",
        "Quantity": 1000,
        "Storage location": "A1"
    },
    {
        "Item": "Cup",
        "Quantity": 200,
        "Storage location": "A1"
    },
    {
        "Item": "Fork",
        "Quantity": 200,
        "Storage location": "A3"
    },
    {
        "Item": "Plate",
        "Quantity": 300,
        "Storage location": "A2"
    },
    {
        "Item": "Cup",
        "Quantity": 700,
        "Storage location": "A2"
    }
]
```

```typescript
import {json2table} from '@lucajung/json2table'

const options = {
    group: ["Item"]
}

json2table.render(data, options)
```