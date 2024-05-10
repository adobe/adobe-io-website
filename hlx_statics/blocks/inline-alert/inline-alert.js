import {
    createTag,
    decorateAnchorLink
  } from '../../scripts/lib-adobeio.js';

  /**
 * loads and decorates the columns
 * @param {Element} block The columns block element
 */
export default async function decorate(block) {
    const container = getBlockSectionContainer(block);
    block.classList.add('spectrum-InLineAlert');
}
  