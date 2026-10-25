# proplens-mcp

MCP server (TypeScript, stdio) for searching property listings from a local JSON file.

## Setup

```
npm i && npm run build && npm test
```

## Run

```
PROPLENS_DATA=listings.json node dist/index.js
```

`PROPLENS_DATA`: path to JSON file, array of Property. Unset = 0 properties (warns on stderr). Invalid file = startup error.

Flags: `-v/--version`, `-h/--help`.

### MCP client config

```json
{ "mcpServers": { "proplens": {
  "command": "node",
  "args": ["/abs/path/proplens-mcp/dist/index.js"],
  "env": { "PROPLENS_DATA": "/abs/path/listings.json" }
} } }
```

## Tools

| tool | input | output |
|---|---|---|
| `ping` | none | `pong` |
| `search_properties` | all optional: `city` (case-insensitive), `type`, `listingType`, `minPrice`, `maxPrice`, `minBedrooms` | JSON array of matching Property |
| `get_property` | `id` | Property JSON, or error `not found: <id>` |

## Property schema

```json
{
  "id": "p1",
  "title": "Sunny flat",
  "type": "apartment",
  "listingType": "rent",
  "price": { "amount": 1200, "currency": "EUR" },
  "bedrooms": 2,
  "bathrooms": 1,
  "areaSqm": 70,
  "address": { "street": "1 Main St", "city": "Lisbon", "region": "Lisboa", "postalCode": "1000", "country": "PT" }
}
```

- `type`: `apartment | house | land | commercial`
- `listingType`: `sale | rent`
- `currency`: 3-letter code. Price filters compare `amount` only, no currency conversion.
- Optional: `bedrooms`, `bathrooms`, `areaSqm`, `address.street/region/postalCode`.
- `minBedrooms` treats missing `bedrooms` as 0.
