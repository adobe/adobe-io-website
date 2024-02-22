import {
  checkExternalLink,
  createTag,
  removeEmptyPTags,
  getBlockSectionContainer,
  decorateAnchorLink,
  applyBkgColorOverride,
  applyWidthOverride,
  applyAnalyticHeaderOverride,
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
  applyAnalyticHeaderOverride(block);
  decorateLightOrDark(block);
  
  if (!container.classList.contains('columns-container')) {
    // eslint-disable-next-line no-console
    console.error('Columns Block expects .columns-container to be parent.');
  }

  removeEmptyPTags(block);

  block.querySelectorAll('h1, h2, h3, h4, h5, h6').forEach((h) => {
    h.classList.add('spectrum-Heading', 'spectrum-Heading--sizeM', 'column-header');
    decorateAnchorLink(h);
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
      const prevElement = p.previousElementSibling;
      if (key === 0) {
        prevElement.insertAdjacentElement("afterend",buttonGroupContainer);
      }
      buttonGroupContainer.appendChild(p);
    });
    column.querySelectorAll('ul').forEach((ul) => {
      ul.parentElement.classList.add('listing');;
      ul.classList.add('spectrum-Body', 'spectrum-Body--sizeM');
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
  applyBkgColorOverride(block);
  applyWidthOverride(block);
}
