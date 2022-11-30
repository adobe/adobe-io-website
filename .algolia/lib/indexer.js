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

const AlgoliaHTMLExtractor = require('algolia-html-extractor');
const algoliasearch = require('algoliasearch');
const axios = require('axios');


/**
 * Indexation mode constants
 */
const INDEXATION_MODE_CONSOLE = 'console', // push data to console
  INDEXATION_MODE_INDEX = 'index'; // push data to index

/**
* Franklin index check constant
*/
const FRANKLIN_INDEX_CHECK = 'franklin';

/**
 * Indexer tool
 *
 * 1. Read the list of pages to be indexed from remote URL
 * 2. Making HTTP requests in a cycle to read pages content
 * 3. Split content of each pages into fragments
 * 4. Push data to Algolia
 */
class Indexer {
  constructor() {
    this.htmlExtractor = new AlgoliaHTMLExtractor();
  }

  /**
   * Run indexer
   *
   * @param {Object} options
   * @returns void
   */
  async run(options) {
    const pagesList = await this.getPagesList(options.pagesListJsonFile);
    const indexRecords = await this.createIndexRecords(pagesList, options);
    await this.pushDataToIndex(indexRecords, options);
  }

  /**
   * @private
   * @param {String} url
   * @returns {Array<Object>}
   */
  async loadContentByUrl(url) {
    let content;
    try {
      content = await axios.get(url);
    } catch (error) {
      throw new Error(`Cannot load content from url: ${error.message}`);
    }
    return content;
  };

  /**
   * @private
   * @param {String} pagesListJsonFile
   * @returns {Array<Object>}
   */
  async getPagesList(pagesListJsonFile) {
    console.log(`\nStart reading a list of pages from ${pagesListJsonFile}.`);
    const pagesListJson = await this.loadContentByUrl(pagesListJsonFile);
    const formatedPagesList = [];

    pagesListJson.data.forEach(({ productName, productIndices }) => {
      productIndices.forEach(({ indexName, indexPathPrefix }) => {
        if (indexName.startsWith(FRANKLIN_INDEX_CHECK)) {
          formatedPagesList.push({
            Index: indexName,
            Url: indexPathPrefix,
            AbsoluteUrl: `https://developer.adobe.com${indexPathPrefix}`,
            ProductName: productName,
            Keywords: "",
          });
        }
      });
    });;
    console.log(`Reading completed. Total page(s) for indexation: ${formatedPagesList.length}.`);
    return formatedPagesList;
  }

  /**
   * @private
   * @param {Object} pagesList
   * @param {Object} options
   * @returns {Object}
   */
  async createIndexRecords(pagesList, options) {
    console.log(`\nStart creating a list of index records:`);

    let records = [];
    for (const page of pagesList) {
      if (!page.Url || !page.AbsoluteUrl || !page.ProductName || !page.Index) {
        throw new Error('Wrong page declaration: ' + JSON.stringify(page));
      }
      const pageContent = await this.loadContentByUrl(page.AbsoluteUrl);
      const extractedData = this.splitPageContent(pageContent.data, options);

      const titleOptions = JSON.parse(JSON.stringify(options));
      titleOptions.tagsToIndex = 'title';
      titleOptions.minWordsCount = 1;
      titleOptions.minCharsLength = 5;
      const title = this.splitPageContent(pageContent.data, titleOptions);
      const theTitle = title.length > 0 ? title[0].content : '';
      const checkIndexEnv = options.algoliaIndexEnvPrefix ? `${options.algoliaIndexEnvPrefix}-${page.Index}` : page.Index;

      const recordsBunch = extractedData.map((htmlTag) => ({
        title: theTitle,
        content: htmlTag.content,
        headings: htmlTag.headings[0],
        objectID: htmlTag.objectID,
        url: page.AbsoluteUrl,
        path: page.Url,
        product: page.ProductName,
        index: checkIndexEnv
      })
      );

      console.log(` - ${recordsBunch.length} record(s) for "${page.ProductName} | ${page.Url} | with index: ${checkIndexEnv}";`);
      records = [...records, ...recordsBunch];
    }
    console.log(`Creating a list of index records completed. Total record(s): ${records.length}.`);
    return records;
  }

  /**
   * @private
   * @param {String} pageContent
   * @param {Object} options
   * @returns {Object}
   */
  splitPageContent(pageContent, options) {
    return this.htmlExtractor
      .run(pageContent, { cssSelector: options.tagsToIndex })
      .filter(
        (htmlTag) =>
          htmlTag.content.trim() !== '' &&
          htmlTag.content.length >= options.minCharsLength &&
          htmlTag.content.split(' ').length >= options.minWordsCount
      );
  }

  /**
  * @private
  * @param {Array} records
  * @returns {Array}
  */
  getUniqueIndexes(records) {
    const indexes = records.map((item) => {
      return item.index
    });
    const uniqueIndexes = [...new Set(indexes)];
    return uniqueIndexes;
  }

  /**
   * @private
   * @param {Object} records
   * @param {Object} options
   * @returns void
   */
  async pushDataToIndex(records, options) {
    const mode = options.indexationMode ? options.indexationMode : INDEXATION_MODE_CONSOLE;

    console.log(`\nStart pushing data to index.`);

    switch (mode) {
      case INDEXATION_MODE_CONSOLE:
        console.log(`Indexation mode is "${mode}". Index records will be published to console:\n`, /* records */);
        break;
      case INDEXATION_MODE_INDEX:
        console.log(`Indexation mode is "${mode}". Index records will be published to Algolia index.`);

        const client = algoliasearch(options.algoliaAppId, options.algoliaWriteAppKey);
        const indexes = this.getUniqueIndexes(records);

        for (const index of indexes) {
          // group records together by index and upload
          const recordsOfIndex = records.filter(record => record.index === index);
          const clientIndex = client.initIndex(index);
          await clientIndex
            .saveObjects(recordsOfIndex)
            .then(({ objectIDs }) => {
              console.log(`Data have been pushed to Algolia index: ${index}`);
            })
            .catch((err) => {
              throw new Error(`Error during pushing data to Algolia: ${err.message}`);
            });

        }

        break;
      default:
        throw new Error(`Wrong indexation mode. Should be [${INDEXATION_MODE_CONSOLE}|${INDEXATION_MODE_INDEX}]`);
    }
    console.log(`Index records have been processed.`);
  }
}
module.exports = Indexer;
