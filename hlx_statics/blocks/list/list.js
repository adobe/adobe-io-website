import { applyWidthOverride, applyBkgColorOverride, applyAnalyticHeaderOverride } from '../../scripts/lib-adobeio.js';

/**
 * decorates the list
 * @param {Element} block The list block element
 */
export default async function decorate(block) {
  const fontcolor = block?.parentElement?.parentElement?.getAttribute('data-fontcolor');
  block.setAttribute('daa-lh', 'list');
  block.querySelectorAll('li').forEach((p) => {
    p.classList.add('spectrum-Body', 'spectrum-Body--sizeL');
    p.style.color = fontcolor;
  });
  applyBkgColorOverride(block);
  applyBkgColorOverride(block);
  applyWidthOverride(block);
  applyAnalyticHeaderOverride(block);
}
