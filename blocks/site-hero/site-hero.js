import {
  removeEmptyPTags,
  getBlockSectionContainer,
} from '../../scripts/lib-adobeio.js';

/**
 * decorates the site-hero
 * @param {Element} block The site-hero block element
 */
export default async function decorate(block) {
  removeEmptyPTags(block);
  const section = getBlockSectionContainer(block);
  section.classList.add('spectrum--dark');
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
  // delete image and re-insert as bg
  const heroImageSrc = block.querySelector('img') ? block.querySelector('img').src.replace('format=png', 'format=webply') : null;
  // alt text
  const heroImageAlt = block.querySelector('img') ? block.querySelector('img').alt : '';
  const span = document.createElement('span');
  span.role = 'img';
  span.setAttribute('aria-label', heroImageAlt);
  section.prepend(span);
  block.querySelectorAll('picture source').forEach((picture) => {
    // remove weird max-width attribute
    picture.media = '';
    picture.parentElement.parentElement.remove();
  });
  section.style.backgroundImage = `url(${heroImageSrc})`;
}
