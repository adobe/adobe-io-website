import { decorateButtons } from '../../scripts/lib-adobeio.js';

/**
 * decorates the error404
 * @param {Element} block The 404 block element
 */
export default async function decorate(block) {
  decorateButtons(block);

  block.querySelectorAll('h1').forEach((h1) => {
    h1.classList.add('spectrum-Heading--sizeXXL', 'spectrum-Heading--serif');
  });
}

