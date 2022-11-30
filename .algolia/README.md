# Algolia indexing for Franklin

Generate index records from remote URLs and push data to Algolia

## Algorithm

1. Read the list of pages to be indexed from remote URL;
2. Making HTTP requests in a cycle to read pages content;
3. Split content of each pages into fragments;
4. Push data to Algolia.

## Env variables

- `ALGOLIA_APP_ID` `(string)` - required to identify the Algolia application for your site's search index.
- `ALGOLIA_WRITE_API_KEY` `(string)` - required to write your search records to the Algolia index.
- `ALGOLIA_INDEXATION_MODE` `[console | index]`
  - `console` mode - index data will be published to console, but not pushed to real search index (default value).
  - `index` mode - index data will be pushed to real search index.
- `ALGOLIA_INDEX_ENV_PREFIX` `[production | stage | *]`
  - `production` prefix - this prefix will be used for indices used for production environment.
  - `stage` prefix - this prefix will be used for indices used for stage environment.
  - `*` is a custom prefix - you can assign any custom prefix for personal testing.
- `PAGES_LIST_JSON_FILE` - List of pages for parsing in JSON format. Should be remote URL.
  - For our search and indexing most likely using `https://raw.githubusercontent.com/AdobeDocs/search-indices/main/product-index-map.json`
  - Which maps to https://github.com/AdobeDocs/search-indices/blob/main/product-index-map.json

Example of the data structure (`PAGES_LIST_JSON_FILE`):

```
[
    {
        "productName": "Adobe After Effects",
        "productIndices": [
            {
                "indexName": "after-effects",
                "indexPathPrefix": "/after-effects/"
            }
        ]
    },
    {
        "productName": "Adobe Analytics",
        "productIndices": [
            {
                "indexName": "analytics-2.0-apis",
                "indexPathPrefix": "/analytics-apis/docs/2.0/"
            }
        ]
    },
    {
        "productName": "Adobe Substance 3D",
        "productIndices": [
            {
                "indexName": "substance-3d-automation",
                "indexPathPrefix": "/substance-3d-automation/docs/"
            },
            {
                "indexName": "franklin-substance-3d-automation",
                "indexPathPrefix": "/substance-3d-automation/"
            },
            {
                "indexName": "franklin-substance-3d",
                "indexPathPrefix": "/substance3d/"
            },
            {
                "indexName": "franklin-substance-3d-sdk",
                "indexPathPrefix": "/substance3d-sdk/"
            }
        ]
    }
]
```

## CLI variables

- `ALGOLIA_INDEXATION_MODE`
- `ALGOLIA_INDEX_ENV_PREFIX`
- `PAGES_LIST_JSON_FILE`

See appropriate description in `Env variables` section.

**Values from CLI will overwrite the values from the Env.**

## Example of usage

1. Run `npm install` in the root folder of tool;
2. Copy `.env.example` to `.env`;
3. Add the appropriate values in the `.env` file;
4. Run `node index.js`;

Alternatively overwrite the following envs with:
4. Run `node index.js --ALGOLIA_INDEXATION_MODE=index --ALGOLIA_INDEX_ENV_PREFIX=stage --PAGES_LIST_JSON_FILE=https://raw.githubusercontent.com/AdobeDocs/search-indices/main/product-index-map.json`;

**The .env should not be committed.**

## TODO

- Explore indexing none Franklin pages from same product index map.

## Legacy TODO

- Add possibility to read JSON pages list from local system;
- Move `tagsToIndex`, `minCharsLength`, `minWordsCount` to CLI parameters.
