import {
  removeEmptyPTags,
  rearrangeHeroPicture,
} from '../../scripts/lib-adobeio.js';

/**
 * decorates the site-hero
 * @param {Element} block The site-hero block element
 */
export default async function decorate(block) {
  removeEmptyPTags(block);
  block.classList.add('spectrum--dark');
  block.querySelectorAll('h1, h2, h3, h4, h5, h6').forEach((h) => {
    h.classList.add('spectrum-Heading', 'spectrum-Heading--sizeXXL', 'spectrum-Heading--serif');
  });
  block.querySelectorAll('p').forEach((p) => {
    const hasLinks = p.querySelectorAll('a, button');
    // don't attach to icon container or if p tag contains links
    if (!p.classList.contains('icon-container') && hasLinks.length === 0) {
      p.classList.add('spectrum-Body', 'spectrum-Body--sizeL');
    }
  });
  const overlayStyle = 'position: absolute; display: flex; left: 50%; top: 50%;  transform: translate(-50%, -50%);';
  rearrangeHeroPicture(block, overlayStyle);
}
