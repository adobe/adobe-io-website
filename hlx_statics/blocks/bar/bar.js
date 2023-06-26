import { decorateButtons, removeEmptyPTags } from '../../scripts/lib-adobeio.js';

/**
 * Rearranges the links into a bar-button-container div
 * @param {*} block The bar block element
 */
function rearrangeLinks(block) {
  const leftDiv = block.firstElementChild.firstElementChild;
  const barButtonContainer = document.createElement('div');
  barButtonContainer.classList.add('bar-button-container');
  leftDiv.querySelectorAll('p.button-container').forEach((p) => {
    barButtonContainer.append(p);
  });
  leftDiv.append(barButtonContainer);
}

/**
 * decorates bar
 * @param {Element} block The bar block element
 */
export default async function decorate(block) {
  block.setAttribute('daa-lh', 'bar');

  block.querySelectorAll('h1, h2, h3, h4, h5, h6').forEach((h) => {
    h.classList.add('spectrum-Heading', 'spectrum-Heading--sizeL', 'bar-heading');
  });

  // Link decoration
  rearrangeLinks(block);
  decorateButtons(block);

  removeEmptyPTags(block);

  block.querySelectorAll('p').forEach((p) => {
    p.classList.add('spectrum-Body', 'spectrum-Body--sizeL');
  });

  block.querySelectorAll('p a').forEach((link) => {
    link.parentElement.classList.add('bar-link');
  });
  


}

