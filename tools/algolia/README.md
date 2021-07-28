# Algolia index generation

Generate index records from remote URLs and push data to Algolia

## Algorithm

1. Read the list of pages to be indexed from remote URL;
2. Making HTTP requests in a cycle to read pages content;
3. Split content of each pages into fragments;
4. Push data to Algolia.

## Env variables

- `ALGOLIA_APP_ID` `(string)` - required to identify the Algolia application for your site's search index;
- `ALGOLIA_WRITE_API_KEY` `(string)` - required to write your search records to the Algolia index;
- `ALGOLIA_INDEX_NAME` `(string)` - Algolia index name (required);
- `ALGOLIA_INDEXATION_MODE` `[console | index]`
  - `console` mode - index data will be published to console, but not pushed to real search index (default value);
  - `index` mode - index data will be pushed to real search index.
- `PAGES_LIST_JSON_FILE` `(string)` - List of pages for parsing in JSON format. Should be remote URL.

Example of pages declaration (`PAGES_LIST_JSON_FILE`):

```
{
  "total": 3,
  "data": [
    {
      "Name": "Homepage",
      "Url": "https://adobe.io"
    },
    {
      "Name": "Open",
      "Url": "https://adobe.io/open"
    },
    {
      "Name": "Apis",
      "Url": "https://adobe.io/apis"
    }
  ]
}
```

## CLI variables

- `ALGOLIA_INDEX_NAME`
- `ALGOLIA_INDEXATION_MODE`
- `PAGES_LIST_JSON_FILE`

See appropriate description in `Env variables` section.

**Values from CLI will overwrite the values from the Env.**

## Example of usage

1. Run `npm install` in the root folder of tool;
2. Copy `.env.example` to `.env`;
3. Add the appropriate values in the `.env` file;
4. Run `node index.js --ALGOLIA_INDEXATION_MODE=index --ALGOLIA_INDEX_NAME=DEVSITE-96 --PAGES_LIST_JSON_FILE=https://adobe-io-website--adobe.hlx.live/algolia/index.json`.

**The .env should not be committed.**

## TODO

- Add possibility to read JSON pages list from local system;
- Move `tagsToIndex`, `minCharsLength`, `minWordsCount` to CLI parameters.
