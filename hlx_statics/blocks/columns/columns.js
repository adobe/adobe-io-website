import {
  checkExternalLink,
  createTag,
  decorateButtons,
  removeEmptyPTags,
  getBlockSectionContainer,
  decorateAnchorLink,
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
  decorateButtons(block);

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
    const hasIcons = p.querySelectorAll('span.icon');
    // don't attach to icon container or if p tag contains icons
    if (!p.classList.contains('icon-container') && hasIcons.length === 0) {
      p.classList.add('spectrum-Body', 'spectrum-Body--sizeM');
    } else if (hasIcons.length > 0) {
      p.classList.add('icon-container');
      // Wraps non-hyperlinked text after icon in a paragraph tag
      p.childNodes.forEach( (child) => {
        if (child.nodeType === Node.TEXT_NODE) {
          const textParagraph = createTag('p', {class:'icon-text'});
          textParagraph.innerText = child.textContent;
          p.replaceChild(textParagraph, child);
        }
      });
    }
  });

  block.querySelectorAll('.columns > div > div').forEach((column) => {
    const buttonGroupContainer = createTag('div', { class: 'button-group-container' });
    column.querySelectorAll('.button-container').forEach((p, key) => {
      const prevElement = p.previousElementSibling;
      if (key === 0) {
        prevElement.insertAdjacentElement('afterend', buttonGroupContainer);
      }
      buttonGroupContainer.appendChild(p);
    });
    column.querySelectorAll('ul').forEach((ul) => {
      ul.parentElement.classList.add('listing');
      ul.classList.add('spectrum-Body', 'spectrum-Body--sizeM');
    });
  });

  block.querySelectorAll('a').forEach((a) => {
    if (!a.classList.contains('button') && !a.classList.contains('spectrum-Button')) {
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
      button.classList.add('spectrum-Button--fill', 'spectrum-Button--accent');
    }
  });

  /* Stop here when metadata is `style: center` */
  if (block.classList.contains('center')) {
    return;
  }

  block.querySelectorAll('.columns > div > div:first-child').forEach((column) => {
    column.classList.add('first-column');
  });
  block.querySelectorAll('.columns > div > div:nth-child(2)').forEach((column) => {
    column.classList.add('second-column');
    const p_text = createTag('p');
    p_text.classList.add('spectrum-Body', 'spectrum-Body--sizeM');
    p_text.innerHTML = column.innerHTML;
    column.innerHTML = "";
    column.append(p_text);
  });

  block.querySelectorAll('div > div.second-column').forEach((secondColumn) => {
    const prevElement = secondColumn.querySelector('p.icon-container')?.previousElementSibling;
    // Only wrap in prdouct link container div if element container icon container
    if (prevElement)
    {
      const productLinkContainer = createTag('div', { class: 'product-link-container' });
      secondColumn.querySelectorAll('p.icon-container').forEach((innerSecond) => {
        productLinkContainer.append(innerSecond);
      });
      // Maintains order within column card
      prevElement.after(productLinkContainer);
    }
  });
  const observer = new IntersectionObserver((entries) => {
    if (entries.some((e) => e.isIntersecting)) {
      observer.disconnect();
      processImages(block);
    }
  });
  observer.observe(block);
}
