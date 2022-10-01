import {
  checkExternalLink,
  createTag,
  removeEmptyPTags,
} from '../../scripts/lib-adobeio.js';

import {
  createOptimizedPicture,
} from '../../scripts/lib-helix.js';

/**
 * loads and decorates the columns
 * @param {Element} block The columns block element
 */
export default async function decorate(block) {
  block.classList.add('spectrum--light');
  removeEmptyPTags(block);
  block.querySelectorAll('.columns > div > div:first-child').forEach((column) => {
    column.classList.add('first-column');
    const p = createTag('p', {class: 'spectrum-Body spectrum-Body--sizeM'});
    const imgSrc = column.querySelector('img')?.src;
    const altText = column.querySelector('img')?.alt;
    const picture = createOptimizedPicture(imgSrc, altText);
    const oldPicture = column.querySelector('picture');
    p.appendChild(picture);
    column.replaceChild(p, oldPicture);
  });
  block.querySelectorAll('.columns > div > div:nth-child(2)').forEach((column) => {
    column.classList.add('second-column');
  });
  block.querySelectorAll('h1, h2, h3, h4, h5, h6').forEach((h) => {
    h.classList.add('spectrum-Heading', 'spectrum-Heading--sizeM', 'column-header');
  });
  block.querySelectorAll('p').forEach((p) => {
    const hasLinks = p.querySelectorAll('a, button');
    // don't attach to icon container or if p tag contains links
    if (!p.classList.contains('icon-container') && hasLinks.length === 0) {
      p.classList.add('spectrum-Body', 'spectrum-Body--sizeM');
    } else if (hasLinks.length > 0) {
      p.classList.add('icon-container');
    }
  });

  block.querySelectorAll('a').forEach((a) => {
    a.classList.add('spectrum-Link', 'spectrum-Link--quiet');
    checkExternalLink(a);
  });

  block.querySelectorAll('div > div.second-column').forEach((secondColumn) => {
    const productLinkContainer = createTag('div', { class: 'product-link-container' });
    secondColumn.querySelectorAll('p.icon-container').forEach((innerSecond) => {
      productLinkContainer.append(innerSecond);
    });
    secondColumn.append(productLinkContainer);
  });
}
