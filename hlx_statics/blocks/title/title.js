import { decorateButtons, removeEmptyPTags,  applyBkgColorOverride } from '../../scripts/lib-adobeio.js';

/**
 * decorates the title
 * @param {Element} block The title block element
 */
export default async function decorate(block) {
  const fontcolor = block?.parentElement?.parentElement?.getAttribute('data-fontcolor');
  const headerFontSize = block?.parentElement?.parentElement?.getAttribute('data-HeaderFontSize');
  const padding = block?.parentElement?.parentElement?.getAttribute('data-Padding');
  const contentAlign = block?.parentElement?.parentElement?.getAttribute('data-ContentAlign');
  
  
  decorateButtons(block);
  removeEmptyPTags(block);
  block.setAttribute('daa-lh', 'title');
  block.querySelectorAll('h1, h2, h3, h4, h5, h6').forEach((h) => {
    if (headerFontSize) {
      h.classList.add('spectrum-Heading', 'spectrum-Heading--sizeL', 'title-heading');
      h.style.color = fontcolor;
      h.style.fontSize = headerFontSize;
    } else {
      h.classList.add('spectrum-Heading', 'spectrum-Heading--sizeL', 'title-heading');
      h.style.color = fontcolor;
    }
  });
  if (padding) {
    block?.parentElement?.parentElement.style.setProperty("padding", padding, "important");
  }
  if (contentAlign) {
    block?.parentElement?.parentElement.style.setProperty("text-align", contentAlign, "important");
  }
  block.querySelectorAll('p').forEach((p) => {
    p.classList.add('spectrum-Body', 'spectrum-Body--sizeL');
    p.style.color = fontcolor;
  });
  applyBkgColorOverride(block);
  
}
