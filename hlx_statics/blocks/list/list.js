import { applyWidthOverride, applyBkgColorOverride } from '../../scripts/lib-adobeio.js';

/**
 * decorates the list
 * @param {Element} block The list block element
 */
export default async function decorate(block) {
  const fontcolor = block?.parentElement?.parentElement?.getAttribute('data-fontcolor');
  const icon = block?.parentElement?.parentElement?.getAttribute('data-icon');
  const iconColor = block?.parentElement?.parentElement?.getAttribute('data-iconcolor');
  block.setAttribute('daa-lh', 'list');
  block.querySelectorAll('li').forEach((list) => {
    list.classList.add('spectrum-Body', 'spectrum-Body--sizeL');
    list.style.color = fontcolor;
    if (icon) {
      list.classList.add("checkmark");
      const checkmarkSpan = document.createElement('span');
      checkmarkSpan.textContent = '\u2713';
      checkmarkSpan.style.position = 'absolute';
      checkmarkSpan.style.left = '0';
      checkmarkSpan.style.top = '0';
      checkmarkSpan.style.color = iconColor;
      list.insertBefore(checkmarkSpan, list.firstChild);
    }
  });

  block.querySelectorAll('ul, ol').forEach((unorder) => {
    unorder.style.color = fontcolor;
    if (icon) {
      unorder.classList.add("checkmark-list");
    }
  });
  applyBkgColorOverride(block);
  applyBkgColorOverride(block);
  applyWidthOverride(block);
}
