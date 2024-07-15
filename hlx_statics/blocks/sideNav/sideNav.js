import { decorateButtons, removeEmptyPTags, applyWidthOverride, applyBkgColorOverride } from '../../scripts/lib-adobeio.js';

/**
 * decorates the side-navbar
 * @param {Element} block The side-navbar block element
 */
export default async function decorate(block) {
  const fontcolor = block?.parentElement?.parentElement?.getAttribute('data-fontcolor');
  decorateButtons(block);
  removeEmptyPTags(block);
  block.setAttribute('daa-lh', 'title');
  block.querySelectorAll('h1, h2, h3, h4, h5, h6').forEach((h) => {
    h.classList.add('spectrum-Heading', 'spectrum-Heading--sizeL', 'title-heading');
    h.style.color = fontcolor;
  });
  block.querySelectorAll('p').forEach((p) => {
    p.classList.add('spectrum-Body', 'spectrum-Body--sizeL');
    p.style.color = fontcolor;
  });
  applyBkgColorOverride(block);
  applyWidthOverride(block);
  block.querySelectorAll('li').forEach((list) => {
    list.classList.add('spectrum-SideNav-item');
  });
  block.querySelectorAll('li a').forEach((list) => {
    list.classList.add('spectrum-SideNav-itemLink');
  });

}
