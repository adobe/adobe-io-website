import { decorateButtons, removeEmptyPTags } from '../../scripts/lib-adobeio.js';

/**
 * decorates the title
 * @param {Element} block The title block element
 */
export default async function decorate(block) {
  const padding = block?.parentElement?.parentElement?.getAttribute('data-Padding');
  const contentAlign = block?.parentElement?.parentElement?.getAttribute('data-ContentAlign');
  decorateButtons(block);
  removeEmptyPTags(block);
  block.setAttribute('daa-lh', 'title');
  block.querySelectorAll('h1, h2, h3, h4, h5, h6').forEach((h) => {
      h.classList.add('spectrum-Heading', 'spectrum-Heading--sizeL', 'title-heading');
  });
  if (padding) {
    block?.parentElement?.parentElement.style.setProperty("padding", padding, "important");
  }
  if (contentAlign) {
    block?.parentElement?.parentElement.style.setProperty("text-align", contentAlign, "important");
  }
  block.querySelectorAll('p').forEach((p) => {
    p.classList.add('spectrum-Body', 'spectrum-Body--sizeL');
  });
}
