import {
  removeEmptyPTags,
  decorateButtons,
  createTag,
} from '../../scripts/lib-adobeio.js';

/**
 * decorates the site-hero
 * @param {Element} block The site-hero block element
 */
export default async function decorate(block) {
  block.setAttribute('daa-lh', 'site hero');
  removeEmptyPTags(block);
  decorateButtons(block);

  const button_div = createTag('div', {class: 'hero-button-container'});

  block.classList.add('spectrum--dark');
  block.querySelectorAll('h1, h2, h3, h4, h5, h6').forEach((h) => {
    h.classList.add('spectrum-Heading', 'spectrum-Heading--sizeXXL');
    h.style.color = "white";
    h.parentElement.classList.add('site-hero-content');
    h.parentElement.append(button_div);
  });

  block.querySelectorAll('p').forEach((p) => {
    const hasLinks = p.querySelectorAll('a, button');
    // don't attach to icon container or if p tag contains links
    if (!p.classList.contains('icon-container')) {
      p.classList.add('spectrum-Body', 'spectrum-Body--sizeL');
      p.style.color = "white";
      button_div.parentElement.querySelector('.spectrum-Heading').after(p);
    }
    if (p.classList.contains('button-container')){
      button_div.append(p);
    }
  });
}
