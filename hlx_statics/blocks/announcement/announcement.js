import { decorateButtons, removeEmptyPTags } from '../../scripts/lib-adobeio.js';

/**
 * decorates the announcement
 * @param {Element} block The announcement block element
 */
export default async function decorate(block) {
  decorateButtons(block);
  removeEmptyPTags(block);
  block.setAttribute('daa-lh', 'announcement');
  block.querySelectorAll('h1, h2, h3, h4, h5, h6').forEach((h) => {
    h.classList.add('spectrum-Heading', 'spectrum-Heading--sizeM', 'announce-heading');
  });
  block.querySelectorAll('p').forEach((paragraph) => {
    paragraph.classList.add('spectrum-Body');
    paragraph.classList.add('spectrum-Body--sizeL');
  });
  block.querySelectorAll('p a').forEach((link) => {
    link.parentElement.classList.add('announce-link');
  });
}
