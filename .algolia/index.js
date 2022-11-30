#!/usr/bin/env node
/*
 * Copyright 2021 Adobe. All rights reserved.
 * This file is licensed to you under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License. You may obtain a copy
 * of the License at http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under
 * the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
 * OF ANY KIND, either express or implied. See the License for the specific language
 * governing permissions and limitations under the License.
 */

const argv = require('minimist')(process.argv.slice(2));
require('dotenv').config();

const indexationOptions = {
  tagsToIndex: 'p, li, td, code',
  minCharsLength: 20,
  minWordsCount: 5,
  indexationMode: argv.ALGOLIA_INDEXATION_MODE ? argv.ALGOLIA_INDEXATION_MODE : process.env.ALGOLIA_INDEXATION_MODE,
  pagesListJsonFile: argv.PAGES_LIST_JSON_FILE ? argv.PAGES_LIST_JSON_FILE : process.env.PAGES_LIST_JSON_FILE
};
const algoliaOptions = {
  algoliaAppId: process.env.ALGOLIA_APP_ID,
  algoliaWriteAppKey: process.env.ALGOLIA_WRITE_API_KEY,
  algoliaIndexEnvPrefix: argv.ALGOLIA_INDEX_ENV_PREFIX ? argv.ALGOLIA_INDEX_ENV_PREFIX : process.env.ALGOLIA_INDEX_ENV_PREFIX
};

const indexer = new (require('./lib/indexer'))();
(async function () {
  const startTime = new Date();

  try {
    console.log('\nStart indexation with options: ' + JSON.stringify(indexationOptions));
    await indexer.run({ ...indexationOptions, ...algoliaOptions });
    console.log('\nIndexation is finished.');
  } catch (e) {
    console.error(`Error during indexation: ${e.message}`);
  }

  const time = new Date() - startTime;
  console.log('\nTotal execution time: ' + (time / 1000).toFixed(3) + ' second(s).');
})();
