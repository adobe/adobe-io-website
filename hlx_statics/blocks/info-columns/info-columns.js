import {
  createTag,
  checkExternalLink,
  removeEmptyPTags,
  
} from '../../scripts/lib-adobeio.js';
import { decorateLightOrDark } from '../../scripts/lib-helix.js';

/**
 * decorates the info-columns
 * @param {Element} block The info-columns block element
 */
export default async function decorate(block) {
  block.setAttribute('daa-lh', 'info column');
  block.querySelectorAll('.info-columns > div > div').forEach((column) => {
    column.classList.add('info-column');
  });
  block.querySelectorAll('.info-column').forEach((column) => {

    decorateLightOrDark(block);

    removeEmptyPTags(column);
    column.querySelectorAll('h1, h2, h3, h4, h5, h6').forEach((h) => {
      h.classList.add('spectrum-Heading', 'spectrum-Heading--sizeM', 'column-header');
    });
    column.querySelectorAll('ul').forEach((ul) => {
      ul.classList.add('spectrum-Body', 'spectrum-Body--sizeM');
    });
    column.querySelectorAll('p').forEach((p) => {
      const hasLinks = p.querySelectorAll('a, button');
      // don't attach to icon container or if p tag contains links
      if (!p.classList.contains('icon-container') && hasLinks.length === 0) {
        p.classList.add('spectrum-Body', 'spectrum-Body--sizeM');
      } else {
        p.classList.add('icon-container');
      }
    });
    column.querySelectorAll('a').forEach((a) => {
      a.classList.add('spectrum-Link', 'spectrum-Link--quiet');
      checkExternalLink(a);
    });
    column.querySelectorAll('div > div.info-column').forEach((infoColumn) => {
      const productLinkContainer = createTag('div', { class: 'product-link-container' });
      infoColumn.querySelectorAll('p.icon-container').forEach((innerSecond) => {
        productLinkContainer.append(innerSecond);
      });
      infoColumn.append(productLinkContainer);
    });
  });  
}
