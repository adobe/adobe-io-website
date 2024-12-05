import { decorateAnchorLink } from '../../scripts/lib-adobeio.js';

/**
 * decorates the list
 * @param {Element} block The list block element
 */
export default async function decorate(block) {
  block.setAttribute('daa-lh', 'list');
  block.querySelectorAll('h1, h2, h3, h4, h5, h6').forEach((h) => {
    h.classList.add('spectrum-Heading', 'spectrum-Heading--sizeM', 'column-header');
    decorateAnchorLink(h);
  });
  block.querySelectorAll('p').forEach((p) => {
      p.classList.add('spectrum-Body', 'spectrum-Body--sizeM');
  });
  block.querySelectorAll('li').forEach((list) => {
    list.classList.add('spectrum-Body', 'spectrum-Body--sizeL');
  });

  block.querySelectorAll('ul, ol').forEach((unorder) => {
    unorder.classList.add('spectrum-Body', 'spectrum-Body--sizeM');
  });
}
