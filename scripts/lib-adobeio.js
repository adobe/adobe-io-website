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
 * Decorates embedded Youtube Links as videos played in an iframe
 */
export async function decorateHelix2Embeds() {
  document.querySelectorAll('main > div > div > p > a[href^="https://youtu.be"], main > div> div > p > a[href^="https://www.youtube.com"]').forEach((yta) => {
    let ytId = '';
    if (yta.href.startsWith('https://youtu.be/')) ytId = new URL(yta.href).pathname;
    if (yta.href.startsWith('https://www.youtube.com/')) ytId = new URLSearchParams(new URL(yta.href).search).get('v');
    const embed = createTag('div', {
      class: 'embed embed-oembed embed-youtu',
      'data-url': `https://youtu.be/${ytId}`,
    });
    embed.innerHTML = `<div style="left: 0; width: 100%; height: 0; position: relative; padding-bottom: 56.25%;">
      <iframe src="https://www.youtube.com/embed/${ytId}?rel=0&amp;kind=embed-youtu&amp;provider=youtu" style="top: 0; left: 0; width: 100%; height: 100%; position: absolute; border: 0;" allowfullscreen="" scrolling="no" allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture;" title="content from youtu" loading="lazy">
        </iframe></div>`;
    yta.closest('div').replaceChild(embed, yta.closest('p'));
    embed.parentElement.className = '';
    embed.parentElement.classList.add('section', 'embed-container', 'spectrum--lightest');
  });
}

/**
 * Decorates embeds with Spectrum styling
 */
export async function decorateEmbeds() {
  document.querySelectorAll('.embed-container').forEach((embed) => {
    embed.classList.add('spectrum--lightest');
    embed.querySelectorAll('h1, h2, h3, h4, h5, h6').forEach((header) => {
      header.classList.add('spectrum-Heading', 'spectrum-Heading--sizeM');
    });
    embed.querySelectorAll('p').forEach((p) => {
      const hasLinks = p.querySelectorAll('a, button');
      // don't attach to icon container or if p tag contains links
      if (!p.classList.contains('icon-container') && hasLinks.length === 0) {
        p.classList.add('spectrum-Body', 'spectrum-Body--sizeM');
      }
    });
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
