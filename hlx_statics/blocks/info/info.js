import {
  createTag,
  decorateAnchorLink,
  
} from '../../scripts/lib-adobeio.js';
import { decorateLightOrDark } from '../../scripts/lib-helix.js';

/**
 * decorates the info
 * @param {Element} block The info block element
 */
export default async function decorate(block) {
  block.setAttribute('daa-lh', 'info');

  decorateLightOrDark(block);

  block.querySelectorAll('h2').forEach((h2) => {
    h2.classList.add('spectrum-Heading', 'spectrum-Heading--sizeM', 'info-header');
    decorateAnchorLink(h2);
    const hr = createTag('hr', { class: 'info-divider' });
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
