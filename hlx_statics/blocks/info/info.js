import {
  createTag,
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
    const anchorLink = createTag('a', { class: 'anchor-link', href: '#' + h2.id });
    anchorLink.innerHTML = '<svg aria-hidden="true" height="18" viewBox="0 0 16 16" width="18">\n' +
      '                  <path d="M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z"></path>\n' +
      '                </svg>';
    h2.appendChild(anchorLink);
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
