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
 * Sets-up Adobe Analytics attributes for click tracking
 * @param {*} domObj The DOM object to inspect, the whole document by default
 */
export function setAnalyticsAttributes(domObj = document) {
  domObj.querySelectorAll('a').forEach((a) => {
    if(a.innerText.length > 0) {
      a.setAttribute('daa-ll', a.innerText);
    }
  });
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
      a.className = 'spectrum-Button spectrum-Button--fill spectrum-Button--cta  spectrum-Button--sizeM';
      twoup.replaceChild(a, up);
    }
  });
}

/**
 * Builds all embed blocks inside a container
 * @param {*} container The container to inspect
 */
export function buildEmbeds(container) {
  const embeds = [...container.querySelectorAll('div > p > a[href^="https://www.youtube.com"], div > p > a[href^="https://youtu.be"]')];
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
  picture.setAttribute('style', 'position: relative; max-width: 100%; display: flex; align-items: center; justify-content: center;');
  const div = block.querySelector('div');
  div.setAttribute('style', overlayStyle);
  const img = picture.querySelector('img');
  img.setAttribute('style', 'width: 100% !important; max-height: 350px');
  emptyDiv.remove();
}

/**
 * Generates the HTML code for the active tab
 * @param {*} width The width of the tab
 * @param {*} isMainPage Defines whether the current page is main page or not
 * @returns The HTML code for the active tab
 */
function activeTabTemplate(width, isMainPage = false) {
  const calcWidth = parseInt(width, 10) - 24;
  return `<div class="nav-link-active" style="width: ${calcWidth}px; transform:translate(12px,0); bottom: ${!isMainPage ? '0.5px' : '-1px'}"></div>`;
}

/**
 * Sets the current tab as active
 * @param {*} isMainPage Defines whether the current page is main page or not
 */
export function setActiveTab(isMainPage) {
  const nav = document.querySelector('#navigation-links');
  let currentPath = window.location.pathname;

  nav.querySelectorAll('li > a').forEach((tabItem) => {
    const hrefPath = new URL(tabItem.href);

    if (hrefPath && hrefPath.pathname) {
      // remove trailing slashes before we compare
      const hrefPathname = hrefPath.pathname.replace(/\/$/, '');
      currentPath = currentPath.replace(/\/$/, '');
      if (currentPath === hrefPathname) {
        const parentWidth = tabItem.parentElement.offsetWidth;
        tabItem.parentElement.innerHTML += activeTabTemplate(parentWidth, isMainPage);
      }
    }
  });
}

/**
 * Checks whether the current URL is one of the top level navigation items
 * @param {*} urlPathname The current URL path name
 * @returns True if the current URL is one of the top level navigation items, false otherwise
 */
export function isTopLevelNav(urlPathname) {
  return urlPathname.indexOf('/apis') === 0
    || urlPathname.indexOf('/open') === 0
    || urlPathname.indexOf('/developer-support') === 0;
}

/**
 * Checks whether the current URL is a dev environment based on host value
 * @param {*} host The host
 * @returns True if the current URL is a dev environment, false otherwise
 */
export function isDevEnvironment(host) {
  return host.indexOf('localhost') >= 0;
}

/**
 * Checks whether the current URL is a stage environment based on host value
 * @param {*} host The host
 * @returns True if the current URL is a stage environment, false otherwise
 */
export function isStageEnvironment(host) {
  return host.indexOf('stage.adobe.io') >= 0
    || host.indexOf('developer-stage') >= 0;
}

/**
 * Checks whether the current URL is a Franklin website based on host value
 * @param {*} host The host
 * @returns True if the current URl is a Franklin website, false otherwise
 */
export function isHlxPath(host) {
  return host.indexOf('hlx.page') >= 0
    || host.indexOf('hlx.live') >= 0
    || host.indexOf('localhost') >= 0;
}

/**
 * Returns expected origin based on the host
 * @param {*} host The host
 * @param {*} suffix A suffix to append
 * @returns The expected origin
 */
export const setExpectedOrigin = (host, suffix = '') => {
  if (isDevEnvironment(host)) {
    return `http://localhost:3000${suffix}`;
  }
  if (isStageEnvironment(host)) {
    return `https://developer-stage.adobe.com${suffix}`;
  }
  if (isHlxPath(host)) {
    return `${window.location.origin}${suffix}`;
  }
  return `https://developer.adobe.com${suffix}`;
};

/**
 * Returns expected origin based on the host
 * @param {*} host The host
 * @param {*} suffix A suffix to append
 * @returns The expected origin
 */
export const setSearchFrameOrigin = (host, suffix = '') => {
  if (isDevEnvironment(host)) {
    return `http://localhost:8000`;
  }
  if (isStageEnvironment(host) || isHlxPath(host)) {
    return `https://developer-stage.adobe.com${suffix}`;
  }
  return `https://developer.adobe.com${suffix}`;
};

/**
 * Returns the franklin closest sub folder
 * @param {*} host The host
 * @param {*} suffix A suffix to append
 * @returns The first subfolder in the franklin dir - for special urls like apis will return the franklin_assets folder
 */
export const getClosestFranklinSubfolder = (host, suffix = '') => {
  let subfolderPath = window.location.pathname.split('/')[1];

  // make sure top level paths point to the same nav if on these paths
  if (subfolderPath === '' || subfolderPath === 'apis' || subfolderPath === 'open' || subfolderPath === 'developer-support') {
    subfolderPath = 'franklin_assets';
  } else {
    subfolderPath = window.location.pathname;
    // strip any ending slash
    if (subfolderPath.charAt(subfolderPath.length-1) === '/') subfolderPath = subfolderPath.substring(0, subfolderPath.length-1);
    // strip any leading slash
    if (subfolderPath.charAt(0) === '/') subfolderPath = subfolderPath.substring(1);
  }

  if (isDevEnvironment(host)) {
    return `http://localhost:3000/${subfolderPath}/${suffix}`;
  }
  if (isStageEnvironment(host)) {
    return `https://developer-stage.adobe.com/${subfolderPath}/${suffix}`;
  }
  if (isHlxPath(host)) {
    return `${window.location.origin}/${subfolderPath}/${suffix}`;
  }
  return `https://developer.adobe.com/${subfolderPath}/${suffix}`;
};

/**
 * Sets given query parameter to provided value and updates URL
 * @param {*} name The query parameter name
 * @param {*} value The value of the query parameter
 * @returns URLSearchParams object state
 */
export const setQueryStringParameter = (name, value) => {
  const params = new URLSearchParams(window.location.search);
  params.set(name, value);
  window.history.replaceState({}, '', `${window.location.pathname}?${params}`);
  return params;
};

/**
 * @returns The query string from the URL
 */
export const getQueryString = () => {
  const params = new URLSearchParams(window.location.search);
  return params;
};

/**
 * Returns the HTML code for the global navigation user profile
 * @param {*} profile The user profile
 * @returns The global navigation user profile for the current user
 */
function globalNavProfileTemplate(profile) {
  return `
    <div class="nav-profile spectrum--lightest">
      <button id="nav-profile-dropdown-button" class="spectrum-ActionButton spectrum-ActionButton--sizeM spectrum-ActionButton--quiet  navigation-dropdown">
        <svg class="spectrum-Icon spectrum-Icon--sizeM" focusable="false" aria-hidden="true" aria-label="Profile">
          <use xlink:href="#spectrum-icon-24-RealTimeCustomerProfile"></use>
        </svg>
      </button>
        <div id="nav-profile-dropdown-popover" class="spectrum-Popover spectrum-Popover--bottom spectrum-Picker-popover spectrum-Picker-popover--quiet">
          <div class="nav-profile-popover-innerContainer">
            <div class="nav-profile-popover-avatar">
              <img alt="Avatar" id="nav-profile-popover-avatar-img" src=${profile.avatarUrl} alt="Profile icon" />
            </div>
            <div class="nav-profile-popover-name">
              <h1 id="nav-profile-popover-name" class="spectrum-Heading spectrum-Heading--sizeM">
                ${profile.name}
              </h1>
            </div>
            <div class="nav-profile-popover-divider">
              <hr />
            </div>
            <a href="https://account.adobe.com/" class="spectrum-Button spectrum-Button--primary spectrum-Button--quiet spectrum-Button--sizeM nav-profile-popover-edit">
              Edit Profile
            </a>
            <a href="#" id="signOut" class="spectrum-Button spectrum-Button--secondary spectrum-Button--sizeM nav-profile-popover-sign-out">
              Sign out
            </a>
          </div>
        </div>
      </div>
    </div>
  `;
}

/**
 * Decorates the profile section based on the current user profile
 * @param {*} profile The current user profile
 */
export function decorateProfile(profile) {
  // replace sign-in link with profile
  const signIn = document.querySelector('div.nav-sign-in');
  const parentContainer = signIn.parentElement;
  signIn.remove();
  parentContainer.insertAdjacentHTML('beforeend', globalNavProfileTemplate(profile));

  const profileDropdownPopover = parentContainer.querySelector('div#nav-profile-dropdown-popover');
  const button = parentContainer.querySelector('button#nav-profile-dropdown-button');

  button.addEventListener('click', (evt) => {
    if (!evt.currentTarget.classList.contains('is-open')) {
      button.classList.add('is-open');
      profileDropdownPopover.classList.add('is-open');
      profileDropdownPopover.ariaHidden = false;
    } else {
      button.classList.remove('is-open');
      profileDropdownPopover.classList.remove('is-open');
      profileDropdownPopover.ariaHidden = false;
    }
  });

  const signOut = parentContainer.querySelector('#signOut');
  signOut.addEventListener('click', (evt) => {
    evt.preventDefault();
    window.adobeIMSMethods.signOut();
  });
}

/**
 * Adds an extra script tag to the document
 * @param {*} element The element to which the script will be added
 * @param {*} scriptUrl The URL to the script to add
 */
export function addExtraScript(element, scriptUrl) {
  const script = createTag('script', { type: 'text/javascript' });
  script.src = scriptUrl;
  element.appendChild(script);
}

/**
 * Adds an extra script tag to the document and adds an onload 
 * @param {*} element The element to which the script will be added
 * @param {*} scriptUrl The URL to the script to add
 * @param {*} onload The on load handler of the script
 */
export function addExtraScriptWithLoad(element, scriptUrl, onload) {
  const script = createTag('script', { type: 'text/javascript' });
  script.src = scriptUrl;
  script.onload = onload;
  element.appendChild(script);
}

/**
 * Adds an extra script tag to the document and returns script
 * Does this need an extra function? Prob not but just to be safe
 * @param {*} element The element to which the script will be added
 * @param {*} scriptUrl The URL to the script to add
 */
export function addExtraScriptWithReturn(element, scriptUrl) {
  const script = createTag('script', { type: 'text/javascript' });
  script.src = scriptUrl;
  element.appendChild(script);
  return script;
}

/**
 * Decorates a header.
 * @param {Element} header The header element to add an anchor link. 
 */
export function decorateAnchorLink(header) {
//  block.querySelectorAll('h1, h2, h3, h4, h5, h6').forEach((h) => {
  header.classList.add('spectrum-Heading', 'spectrum-Heading--sizeM', 'column-header');
  const anchorLink = createTag('a', { class: 'anchor-link', href: '#' + header.id });
  anchorLink.innerHTML = '<svg aria-hidden="true" height="18" viewBox="0 0 16 16" width="18">\n' +
    '                  <path d="M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z"></path>\n' +
    '                </svg>';
  header.appendChild(anchorLink);
  // });
}

/**
 * Set the width of a block from Section Metadata.
 * @param {Element} The element to add the width style to.
 */
export function applyWidthOverride(block) {
  const wid = block?.parentElement?.parentElement?.getAttribute('data-width');
  if (wid) {
    const widToInt = parseInt(wid.slice(0,wid.length-2));
    if (widToInt >= 320 && widToInt <= 1920)
    block.style.width = wid;
  }
}

/**
 * set the background color of a block from Section Metadata
 * @param {Element} The element to add the background color style to.
 */
export function applyBkgColorOverride(block) {
  const color = block?.parentElement?.parentElement?.getAttribute('data-backgroundcolor');
  if (color == "white") {
    block.parentElement.parentElement.style.backgroundColor = color;
  } else if (color == "navy") {
    block.parentElement.parentElement.style.backgroundColor = "rgb(15, 55, 95)";
  }
  // Support the old style
  if(block.parentElement.parentElement.classList.contains('background-color-white')){
    block.parentElement.parentElement.style.backgroundColor = 'white';
  };
}

/**
 * Set the title of a block from Section Metadata.
 * @param {Element} The element to add the title to.
 */
export function applySectionTitle(block) {
  const title = block?.parentElement?.parentElement?.getAttribute('data-title');
  if (title) {
    const titleElement = document.createElement('h2');
    titleElement.innerHTML = title;
    titleElement.classList.add('spectrum-Heading', 'spectrum-Heading--sizeL', 'section-title');
    block?.parentElement?.parentElement?.prepend(titleElement);
  }
}

/**
 * Set the analytic header of a block from Section Metadata.
 * @param {Element} The element to set the analytic heading attribute.
 */
export function applyAnalyticHeaderOverride(block) {
  const heading = block?.parentElement?.parentElement?.getAttribute('data-analytic-heading');
  if (heading) {
    block.setAttribute('daa-lh', heading);
  }
}
