import {
  createTag,
} from '../../scripts/lib-adobeio.js';

/**
 * decorates the info
 * @param {Element} block The info block element
 */
export default async function decorate(block) {
  block.classList.add('spectrum--light');
  block.querySelectorAll('h2').forEach((h2) => {
    h2.classList.add('spectrum-Heading', 'spectrum-Heading--sizeM');
    const hr = createTag('hr', { class: 'spectrum-Divider spectrum-Divider--sizeL' });
    h2.after(hr);
  });
  block.querySelectorAll('p').forEach((p) => {
    p.classList.add('spectrum-Body', 'spectrum-Body--sizeM');
  });
  block.querySelectorAll('ul').forEach((ul) => {
    ul.classList.add('spectrum-Body', 'spectrum-Body--sizeM');
  });
  block.querySelectorAll('a').forEach((a) => {
    a.classList.add('spectrum-Link', 'spectrum-Link--quiet');
  });
}
