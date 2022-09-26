import {
  buildBlock,
} from './lib-helix.js';

/**
 * Breakpoints
 */
export const MOBILE_SCREEN_WIDTH = 700;
export const LARGE_SCREEN_WIDTH = 1280;

/**
 * Checks if an a tag href points to an external link.
 * Updates the tag target and rel attributes accordingly.
 * @param {*} a The a tag to check
 */
export function checkExternalLink(a) {
  const url = a.href;
  if (url.indexOf('developer.adobe.com') === -1
    && url.indexOf('hlx.page') === -1
    && url.indexOf('hlx.live') === -1) {
    a.target = '_blank';
    a.rel = 'noopener noreferrer';
  }
}

/**
 * Returns the container div of a block
 * @param {*} block The block to retrieve the container div from
 * @returns The container div of the block, null otherwise
 */
export function getBlockSectionContainer(block) {
  return (block && block.parentElement && block.parentElement.parentElement)
    ? block.parentElement.parentElement
    : null;
}

/**
 * Creates a tag with the given name and attributes.
 * @param {string} name The tag name
 * @param {object} attrs An object containing the attributes
 * @returns The new tag
 */
export function createTag(name, attrs) {
  const el = document.createElement(name);
  if (typeof attrs === 'object') {
    Object.entries(attrs).forEach(([key, value]) => {
      el.setAttribute(key, value);
    });
  }
  return el;
}

/**
 * Sets-up event listeners to handle focus and blur for the elements of a DOM object
 * @param {*} domObj The DOM object to inspect, the whole document by default
 */
export function focusRing(domObj = document) {
  domObj.querySelectorAll('a.spectrum-Link').forEach((a) => {
    a.addEventListener('focus', () => {
      a.classList.add('focus-ring');
    });

    a.addEventListener('blur', () => {
      a.classList.remove('focus-ring');
    });
  });

  domObj.querySelectorAll('a.spectrum-Button').forEach((button) => {
    button.addEventListener('focus', () => {
      button.classList.add('focus-ring');
    });

    button.addEventListener('blur', () => {
      button.classList.remove('focus-ring');
    });
  });

  domObj.querySelectorAll('div.spectrum-Card').forEach((card) => {
    card.addEventListener('focus', () => {
      card.classList.add('focus-ring');
    });

    card.addEventListener('blur', () => {
      card.classList.remove('focus-ring');
    });
  });

  domObj.querySelectorAll('a.spectrum-Card').forEach((card) => {
    card.addEventListener('focus', () => {
      card.classList.add('focus-ring');
    });

    card.addEventListener('blur', () => {
      card.classList.remove('focus-ring');
    });
  });

  domObj.querySelectorAll('input.spectrum-Checkbox-input').forEach((input) => {
    input.addEventListener('focus', () => {
      input.classList.add('focus-ring');
    });

    input.addEventListener('blur', () => {
      input.classList.remove('focus-ring');
    });
  });

  domObj.querySelectorAll('button.spectrum-Picker').forEach((button) => {
    button.addEventListener('focus', () => {
      button.classList.add('focus-ring');
    });

    button.addEventListener('blur', () => {
      button.classList.remove('focus-ring');
    });
  });

  domObj.querySelectorAll('div.nav-sign-in button').forEach((button) => {
    button.addEventListener('focus', () => {
      button.classList.add('focus-ring');
    });

    button.addEventListener('blur', () => {
      button.classList.remove('focus-ring');
    });
  });
}

/**
 * Removes empty children p tags of a given element
 * @param {*} element The element to inspect
 */
export function removeEmptyPTags(element) {
  element.querySelectorAll('p').forEach((p) => {
    // get rid of empty p tags
    if (!p.hasChildNodes()) {
      p.remove();
    }
  });
}

/**
 * Decorates the a tags of a block as Spectrum Buttons
 * @param {*} block The block to inspect
 */
export function decorateButtons(block) {
  block.querySelectorAll('a').forEach((a) => {
    a.innerHTML = `<span class="spectrum-Button-label">${a.innerHTML}</span>`;
    const up = a.parentElement;
    const twoup = a.parentElement.parentElement;
    a.tabindex = 0;
    if (up.childNodes.length === 1 && up.tagName === 'P') {
      a.className = 'spectrum-Button spectrum-Button--fill spectrum-Button--secondary  spectrum-Button--sizeM';
    }

    checkExternalLink(a);

    if (
      up.childNodes.length === 1
      && up.tagName === 'STRONG'
      && twoup.childNodes.length === 1
      && twoup.tagName === 'P'
    ) {
      a.className = 'spectrum-Button spectrum-Button--fill spectrum-Button--accent  spectrum-Button--sizeM';
      twoup.replaceChild(a, up);
    }
  });
}

/**
 * Builds all embed blocks inside a container
 * @param {*} container The container to inspect
 */
export function buildEmbeds(container) {
  const embeds = [...container.querySelectorAll('div > p > a[href^="https://www.youtube.com"], div > p > a[href^="https://gist.github.com"]')];
  embeds.forEach((embed) => {
    const block = buildBlock('embed', embed.outerHTML);
    embed.replaceWith(block);
    block.classList.add('block');
    const parentContainer = block.parentElement.parentElement;
    parentContainer.prepend(block);
    removeEmptyPTags(parentContainer);
  });
}

/**
 * Toggles the scale according to the client width
 */
export function toggleScale() {
  const doc = document.documentElement;
  const isLargeScale = doc.clientWidth < MOBILE_SCREEN_WIDTH;
  doc.classList.toggle('spectrum--medium', !isLargeScale);
  doc.classList.toggle('spectrum--large', isLargeScale);
}

/**
 * Rearranges the hero picture of a block to be properly optimized and overlaid by text
 * @param {*} block The block containing the picture to rearrange
 */
export function rearrangeHeroPicture(block, overlayStyle) {
  const picture = block.querySelector('picture');
  const emptyDiv = picture.parentElement.parentElement;
  block.prepend(picture);
  picture.setAttribute('style', 'position: "relative"; max-width: "100%"; display: "flex"; align-items: "center"; justify-content: "center";');
  const div = block.querySelector('div');
  div.setAttribute('style', overlayStyle);
  const img = picture.querySelector('img');
  img.setAttribute('style', 'width: 100% !important');
  emptyDiv.remove();
}
