import {
  checkExternalLink,
  createTag,
  removeEmptyPTags,
  getBlockSectionContainer,
} from '../../scripts/lib-adobeio.js';

import {
  createOptimizedPicture,
  decorateLightOrDark,
} from '../../scripts/lib-helix.js';

/**
 * Generates optimized images for all columns in the block
 * @param {*} block The columns block
 */
function processImages(block) {
  block.querySelectorAll('picture > img').forEach((img) => {
    const picture = createOptimizedPicture(img.src, img.alt);
    const parent = img.parentElement.parentElement;
    const p = createTag('p', { class: 'spectrum-Body spectrum-Body--sizeM' });
    p.appendChild(picture);
    parent.replaceChild(p, img.parentElement);
  });
}

/**
 * loads and decorates the columns
 * @param {Element} block The columns block element
 */
export default async function decorate(block) {
  const container = getBlockSectionContainer(block);

  block.setAttribute('daa-lh', 'column');

  decorateLightOrDark(block);

  if (!container.classList.contains('columns-container')) {
    // eslint-disable-next-line no-console
    console.error('Columns Block expects .columns-container to be parent.');
  }

  removeEmptyPTags(block);

  block.querySelectorAll('h1, h2, h3, h4, h5, h6').forEach((h) => {
    h.classList.add('spectrum-Heading', 'spectrum-Heading--sizeM', 'column-header');
    const anchorLink = createTag('a', { class: 'anchor-link', href: '#' + h.id });
    anchorLink.innerHTML = '<svg aria-hidden="true" height="18" viewBox="0 0 16 16" width="18">\n' +
      '                  <path d="M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z"></path>\n' +
      '                </svg>';
    h.appendChild(anchorLink);
  });
  block.querySelectorAll('p').forEach((p) => {
    const hasLinks = p.querySelectorAll('a, button');
    // don't attach to icon container or if p tag contains links
    if (!p.classList.contains('icon-container') && hasLinks.length === 0) {
      p.classList.add('spectrum-Body', 'spectrum-Body--sizeM');
    } else if (hasLinks.length > 0) {
      p.classList.add('icon-container');
    }
  });

  block.querySelectorAll('.columns > div > div').forEach((column) => {
    const buttonGroupContainer = createTag('div', { class: 'button-group-container' });
    column.querySelectorAll('.button-container').forEach((p, key) => {
      if (key === 0) {
        p.parentElement.appendChild(buttonGroupContainer);
      }
      buttonGroupContainer.appendChild(p);
    });
  });

  block.querySelectorAll('a').forEach((a) => {
    if (!a.classList.contains('button')) {
      a.classList.add('spectrum-Link', 'spectrum-Link--quiet');
    }
    if (!a.classList.contains('anchor-link')) {
      checkExternalLink(a);
    }
  });

  block.querySelectorAll('.button').forEach((button) => {
    button.classList.add('spectrum-Button', 'spectrum-Button--sizeM');
    if (button.parentElement.tagName.toLowerCase() !== 'strong') {
      button.classList.add('spectrum-Button--secondary', 'spectrum-Button--outline');
    } else {
      button.parentElement.replaceWith(button);
      button.classList.add('spectrum-Button--cta');
    }
  });

  /* Stop here when metadata is `style: center` */
  if (container.classList.contains('center')) {
    return;
  }

  block.querySelectorAll('.columns > div > div:first-child').forEach((column) => {
    column.classList.add('first-column');
  });
  block.querySelectorAll('.columns > div > div:nth-child(2)').forEach((column) => {
    column.classList.add('second-column');
  });

  block.querySelectorAll('div > div.second-column').forEach((secondColumn) => {
    const productLinkContainer = createTag('div', { class: 'product-link-container' });
    secondColumn.querySelectorAll('p.icon-container').forEach((innerSecond) => {
      productLinkContainer.append(innerSecond);
    });
    secondColumn.append(productLinkContainer);
  });
  const observer = new IntersectionObserver((entries) => {
    if (entries.some((e) => e.isIntersecting)) {
      observer.disconnect();
      processImages(block);
    }
  });
  observer.observe(block);
}
