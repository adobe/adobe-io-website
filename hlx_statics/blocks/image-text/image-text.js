import { decorateButtons,  applyBkgColorOverride } from '../../scripts/lib-adobeio.js';

/**
 * Rearranges the links into a image-text-button-container div
 * @param {*} block The image-text block element
 */
function rearrangeLinks(block) {
  const leftDiv = block.firstElementChild.lastElementChild;
  const rightDiv = block.lastElementChild.lastElementChild;
  const imageTextBlockLeftButton = document.createElement('div');
  const imageTextBlockRightButton = document.createElement('div');
  imageTextBlockLeftButton.classList.add('image-text-button-container');
  imageTextBlockRightButton.classList.add('image-text-button-container');
  leftDiv.querySelectorAll('p.button-container').forEach((p) => {
    imageTextBlockLeftButton.append(p);
  });
  rightDiv.querySelectorAll('p.button-container').forEach((p) => {
    imageTextBlockRightButton.append(p);
  });
  leftDiv.append(imageTextBlockLeftButton);
  rightDiv.append(imageTextBlockRightButton);
}

/**
 * decorates the image-text
 * @param {Element} block The image-text block element
 */
export default async function decorate(block) {
  const fontcolor = block?.parentElement?.parentElement?.getAttribute('data-fontcolor');
  decorateButtons(block);
  block.setAttribute('daa-lh', 'image-text');
  block.querySelectorAll('h1, h2, h3, h4, h5, h6').forEach((h) => {
    h.classList.add('spectrum-Heading', 'spectrum-Heading--sizeL', 'title-heading');
    h.style.color = fontcolor;
  });
  block.querySelectorAll('p').forEach((p) => {
    p.classList.add('spectrum-Body', 'spectrum-Body--sizeL');
    p.style.color = fontcolor;
  });
  applyBkgColorOverride(block);
  
  rearrangeLinks(block);
}
