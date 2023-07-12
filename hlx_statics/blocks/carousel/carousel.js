import { decorateButtons,rearrangeHeroPicture } from '../../scripts/lib-adobeio.js';


/**
 * decorates the carousel
 * @param {Element} block The carousel block element
 */
export default async function decorate(block) {
  decorateButtons(block);
  block.querySelectorAll('h1, h2, h3, h4, h5, h6').forEach((h) => {
    h.classList.add('spectrum-Heading', 'spectrum-Heading--sizeL');
  });
  block.querySelectorAll('p').forEach((p) => {
    p.classList.add('spectrum-Body', 'spectrum-Body--sizeL');
  });
  block.querySelectorAll('p').forEach((paragraph) => {
    paragraph.classList.add('spectrum-Body');
    paragraph.classList.add('spectrum-Body--sizeL');
  });

  


}

