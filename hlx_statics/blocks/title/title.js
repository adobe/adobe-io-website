import { decorateButtons, removeEmptyPTags, applyWidthOverride, applyBkgColorOverride, applyAnalyticHeaderOverride } from '../../scripts/lib-adobeio.js';

/**
 * decorates the title
 * @param {Element} block The title block element
 */
export default async function decorate(block) {
  const fontcolor = block?.parentElement?.parentElement?.getAttribute('data-fontcolor');
  const headerFontSize = block?.parentElement?.parentElement?.getAttribute('data-HeaderFontSize');
  const padding = block?.parentElement?.parentElement?.getAttribute('data-Padding');

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
  block.querySelectorAll('p').forEach((p) => {
    p.classList.add('spectrum-Body', 'spectrum-Body--sizeL');
    p.style.color = fontcolor;
  });
  applyBkgColorOverride(block);
  applyWidthOverride(block);
  applyAnalyticHeaderOverride(block);
}
