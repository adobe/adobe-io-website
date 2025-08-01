import { buildBlock, getLinks, getMetadata, IS_DEV_DOCS, loadCSS } from './lib-helix.js';
import decoratePreformattedCode from '../components/code.js';

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
  const [_, queryString] = url.split('?');
  const searchParams = new URLSearchParams(queryString);
  const internalDomains = ['developer.adobe.com', 'developer-stage.adobe.com', 'developer-dev.adobe.com', 'hlx.page', 'hlx.live'];
  const isExternal = !internalDomains.some(domain => url.includes(domain)) || searchParams.has('aio_external');
  if (isExternal) {
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
export function decorateButtons(block, secondaryButtonBorderColor, secondaryButtonColor) {
  getLinks(block, 'button').forEach((a) => {
    a.innerHTML = `<span class="spectrum-Button-label" >${a.innerHTML}</span>`;
    const up = a.parentElement;
    const twoup = a.parentElement.parentElement;
    a.tabindex = 0;
    if (up.childNodes.length === 1 && up.tagName === 'P') {
      a.className = 'spectrum-Button spectrum-Button--outline spectrum-Button--secondary spectrum-Button--sizeM';
      const innerHTML = a.querySelector('span');

      if (secondaryButtonBorderColor) {
        a.style.borderColor = secondaryButtonBorderColor;
      }
      if (secondaryButtonColor) {
        innerHTML.style.color = secondaryButtonColor;
      }
    }

    if (
      up.childNodes.length === 1
      && up.tagName === 'STRONG'
      && twoup.childNodes.length === 1
      && twoup.tagName === 'P'
    ) {
      a.className = 'spectrum-Button spectrum-Button--fill spectrum-Button--accent spectrum-Button--sizeM';
      twoup.replaceChild(a, up);
    }
  });
}

/**
 * Decorates all inline codes in a container element.
 * @param {Element} element container element
 */
export function decorateInlineCodes(element) {
  element.querySelectorAll('code').forEach((code) => {
    const up = code.parentElement;

    if (up.tagName !== 'PRE') {
      code.classList.add('inline-code');
    }
  });
}

/**
 * Decorates all nested codes in a container element.
 * @param {Element} element container element
 */
export function decorateNestedCodes(element) {
  element.querySelectorAll('div.default-content-wrapper pre > code').forEach((code) => {
    const pre = code.parentElement;

    const wrapper = createTag('div', { class: 'nested-code-wrapper' });
    pre.replaceWith(wrapper);
    wrapper.append(pre);

    loadCSS(`${window.hlx.codeBasePath}/blocks/code/code.css`);
    decoratePreformattedCode(wrapper);
  });

}

/**
 * Builds all code blocks inside a container
 * @param {*} container The container to inspect
 */
export function buildCodes(container) {
  const allCodes = [...container.querySelectorAll('main > div > pre > code')];

  allCodes.forEach((code) => {
    const block = buildBlock('code', code.outerHTML);
    const allPreElements = [...document.querySelectorAll('main > div > pre')];
    const validPreElements = allPreElements.filter(pre => {
      // Check if the closest div ancestor has the class 'inlinealert'
      return !pre.closest('div.inlinealert');
    });
    validPreElements[0].replaceWith(block);
  });
}

/**
 * Builds all hr blocks inside a container
 * @param {*} container The container to inspect
 */
export function decorateHR(container) {
  const hrWrappers = container.querySelectorAll('main div.horizontalline-wrapper div.horizontalline');

  hrWrappers.forEach(hrWrapper => {
    const hr = document.createElement('hr');
    hrWrapper.innerHTML = ''
    hrWrapper.appendChild(hr)
  });
}

/**
 * Builds all embed blocks inside a container
 * @param {*} container The container to inspect
 */
export function buildEmbeds(container) {
  const embeds = [...container.querySelectorAll('div > p > a[href^="https://www.youtube.com"], div > p > a[href^="https://youtu.be"]')];
  if(getMetadata('template') !== 'documentation'){
  embeds.forEach((embed) => {
    const block = buildBlock('embed', embed.outerHTML);
    embed.replaceWith(block);
    block.classList.add('block');
    const parentContainer = block.parentElement.parentElement;
    parentContainer.prepend(block);
    removeEmptyPTags(parentContainer);
  });
 }
}

/**
 * Builds all heading blocks inside a container
 * @param {*} container The container to inspect
 */
export function buildHeadings(container) {
  const map = [
    { elementName: 'h1', blockName: 'heading1' },
    { elementName: 'h2', blockName: 'heading2' },
    { elementName: 'h3', blockName: 'heading3' },
    { elementName: 'h4', blockName: 'heading4' },
    { elementName: 'h5', blockName: 'heading5' },
    { elementName: 'h6', blockName: 'heading6' },
  ];
  map.forEach(({ elementName, blockName }) => {
    const elements = [...container.querySelectorAll(`main > div > ${elementName}`)];
    elements.forEach((element) => {
      const block = buildBlock(blockName, element.outerHTML);
      element.replaceWith(block);
      block.classList.add('block');
    });
  });
}

/**
 * Builds the layout grid
 * @param {*} main The grid container
 */
export function buildGrid(main) {
  main.style.display = 'grid';

  const mainContainer = document.querySelector('main');
  mainContainer.style.display = 'grid';

  const gridAreaMain = main.querySelector('.section');
  if (gridAreaMain) gridAreaMain.style.gridArea = 'main';

  const sideNav = document.querySelector('.side-nav');
  if (sideNav) sideNav.style.gridArea = 'sidenav';

  const footer = document.querySelector('footer');
  if (footer) footer.style.gridArea = 'footer';

  const aside = document.querySelector('aside');
  if (aside) aside.style.gridArea = 'aside';

  if (gridAreaMain) {
    let contentHeader = createTag('div', { class: 'content-header' });
    gridAreaMain.prepend(contentHeader);
  }
}

/**
 * Builds the div with style*="grid-area: main"
 * @param {*} main The grid container
 */
export function buildGridAreaMain(main) {
  const herosimpleWrapper = main.querySelector('.herosimple-wrapper');
  const gridAreaMain = main.querySelector('main > div[style*="grid-area: main"]');
  const subParent = createTag("div", { class: "sub-parent" });
  if (herosimpleWrapper) {
    const children = Array.from(gridAreaMain.children);
    children.forEach((child) => {
      if (!child.classList.contains("herosimple-wrapper")) {
        subParent.appendChild(child);
      }
    });
    gridAreaMain.insertBefore(subParent, herosimpleWrapper.nextSibling);
  } else {
    gridAreaMain.appendChild(subParent);
  }
}

/**
 * Builds the side nav
 * @param {*} main The grid container
 */
export function buildSideNav(main) {
  let sideNavDiv = createTag('div', { class: 'section side-nav-container', style: 'grid-area: sidenav;'});
  let sideNavWrapper = createTag('div', { class: 'side-nav-wrapper' });
  let sideNavBlock = createTag('div', { class: 'side-nav block', 'data-block-name': 'side-nav' });
  sideNavWrapper.append(sideNavBlock);
  sideNavDiv.append(sideNavWrapper);
  main.prepend(sideNavDiv);
}

/**
 * Builds the side nav
 * @param {*} main The sitewidebanner container
 */
export function buildSiteWideBanner(main) {
  let siteWideBannerDiv = createTag('div', { class: 'section site-wide-banner-container fixed-banner' });
  let siteWideBannerWrapper = createTag('div', { class: 'site-wide-banner-wrapper' });
  let siteWideBannerBlock = createTag('div', { class: 'site-wide-banner block', 'data-block-name': 'site-wide-banner' });
  siteWideBannerWrapper.append(siteWideBannerBlock);
  siteWideBannerDiv.append(siteWideBannerWrapper);
  main.prepend(siteWideBannerDiv);
}

/**
 * Builds the on this page wrapper
 * @param {*} main The grid container
 */
export function buildOnThisPage(main) {
  let asideWrapper = createTag('div', { class: 'onthispage-wrapper block', 'data-block-name': 'onthispage' });
  main.append(asideWrapper);
}

/**
 * Builds resources component
 * @param {*} main The grid container
 */
export function buildResources(main) {
  let asideWrapper;
  if (document.querySelector('.onthispage-wrapper') != null) {
    // if there's onthispage, move it with the onthispage.
    asideWrapper = document.querySelector('.onthispage-wrapper');
    const resourcesWrapper = document.querySelector('.resources-wrapper');
    if (resourcesWrapper) {
      asideWrapper.insertBefore(resourcesWrapper, asideWrapper.firstChild);
    }
  } else {
    // if there's no onthispage, make a main-resources-wrapper div that contains the sub-parent and the resources block.
    let mainResourcesWrapper = createTag('div', { class: 'main-resources-wrapper'});
    const resourcesWrapper = document.querySelector('.resources-wrapper');
    mainResourcesWrapper.appendChild(resourcesWrapper);
    const subparent = document.querySelector('.sub-parent');
    mainResourcesWrapper.insertBefore(subparent, mainResourcesWrapper.firstChild);
    const resourceContainer = document.querySelector('.resources-container');
    resourceContainer.append(mainResourcesWrapper);
  }

}

/**
 * Builds the next-prev wrapper
 * @param {*} main The grid container
 */
export function buildNextPrev(main) {
  let nextPrevWrapper = createTag('div', { class: 'next-prev-wrapper block', 'data-block-name': 'next-prev' });
  const gridAreaMain = main.querySelector('div[style*="grid-area: main"]');
  gridAreaMain.appendChild(nextPrevWrapper)
}

/**
 * Builds the breadcrumbs
 * @param {*} main The grid container
 */
export function buildBreadcrumbs(main) {
  let breadcrumbsDiv = createTag('div', { class: 'section breadcrumbs-container' });
  let breadcrumbsWrapper = createTag('div', { class: 'breadcrumbs-wrapper' });
  let breadcrumbsBlock = createTag('div', { class: 'breadcrumbs block', 'data-block-name': 'breadcrumbs' });

  breadcrumbsWrapper.append(breadcrumbsBlock);
  breadcrumbsDiv.append(breadcrumbsWrapper);

  const contentHeader = main.querySelector('.content-header');
  contentHeader?.append(breadcrumbsDiv);
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
  img.setAttribute('style', 'width: 100% !important; height: 350px');
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
  if (nav) {
    const actTab = getActiveTab(nav);
    if (actTab) {
      activateTab(actTab);
    }
    if (IS_DEV_DOCS) {
      activeSubNav(actTab);
    }
  }
}

export function getActiveTab(nav) {
  let currentPath = window.location.pathname;
  let bestMatch = null;
  let bestMatchLength = 0;

  const links = Array.from(nav.querySelectorAll('a'));
  for (const tabItem of links) {
    const hrefPath = new URL(tabItem.href);
    const fullPath = tabItem.getAttribute('fullPath');

    if (hrefPath && hrefPath.pathname && !fullPath) {
      // remove trailing slashes before we compare
      const hrefPathname = hrefPath.pathname.replace(/\/$/, '');
      currentPath = currentPath.replace(/\/$/, '');
      // 1. Exact match
      if (currentPath === hrefPathname) {
        bestMatch = tabItem;
        break;
      }

      // 2. Check if it's a valid parent (subpath) and prioritize the deepest match
      if (isSubpath(hrefPathname, currentPath) && hrefPathname.length > bestMatchLength) {
        bestMatch = tabItem;
        bestMatchLength = hrefPathname.length;
      }
    }
  };

  return bestMatch
}

// Function to check if `childPath` is a subpath of `parentPath`
function isSubpath(parentPath, childPath) {
  return childPath.startsWith(parentPath) &&
      (childPath.length === parentPath.length || childPath[parentPath.length] === '/');
}

// Function to mark tab as active
function activateTab(tabItem, isMainPage) {
  let underlineItem = tabItem;
  if (tabItem.closest('.nav-dropdown-popover')){
    // if the item is within a dropdown, it needs to find the parent item to be underlined.
    underlineItem = tabItem.closest('.nav-dropdown-popover');
  }
  underlineItem.parentElement.classList.add("activeTab");
}

function activeSubNav(actTab) {
  let showSidenav = false;
  if (actTab) {
    const navLinksUl = document.querySelector(".side-nav-subpages-section");
    const sidenavItems = navLinksUl?.querySelectorAll(':scope > ul li') || [];
    const topNavPath = actTab.pathname;
    const pagePath = window.location.pathname;
    sidenavItems.forEach(li => {
      const link = li.querySelector(':scope > a');
      if (link) {
        const linkPath = new URL(link.href, window.location.origin).pathname;
        if (linkPath === pagePath) {
          showSidenav = true;
        }
        if (!linkPath.startsWith(topNavPath)) {
          li.classList.add('hidden');
        }
      } else {
        li.classList.add('hidden');
      }
    });
  }
  if (!showSidenav) {
    document.querySelector("main").classList.add("no-sidenav");
  }
  const sidecontainer = document.querySelector(".side-nav-container");
  sidecontainer.style.visibility = "visible";
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
export function isLocalHostEnvironment(host) {
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
 * Checks whether the current URL is a dev environment based on host value
 * @param {*} host The host
 * @returns True if the current URL is a dev environment, false otherwise
 */
export function isDevEnvironment(host) {
  return host.indexOf('developer-dev') >= 0;
}

/**
 * Checks whether the current URL is the prod environment based on host value
 * @param {*} host The host
 * @returns True if the current URL is a prod environment, false otherwise
 */
export function isProdEnvironment(host) {
  return host.indexOf('developer.adobe.com') >= 0;
}

/**
 * Checks whether the current URL is a Franklin website based on host value
 * @param {*} host The host
 * @returns True if the current URl is a Franklin website, false otherwise
 */
export function isHlxPath(host) {
  return host.indexOf('hlx.page') >= 0
    || host.indexOf('hlx.live') >= 0
    || host.indexOf('localhost') >= 0
    || host.indexOf('aem.page') >= 0
    || host.indexOf('aem.live') >= 0;
}

/**
 * Returns the absolute URL for a resource.
 * @param {*} path The resource path. Either absolute or relative within root/static folder.
 * @returns path if absolute. The calculated raw git URL, otherwise.
 */
export function getResourceUrl(path) {
  const isAbsolute = path.indexOf("://") > 0 || path.indexOf("//") === 0;
  if(isAbsolute) {
    return path;
  }

  const blobPath = getMetadata('githubblobpath');
  const pathPrefix = getMetadata('pathprefix');
  const githubPath ='https://github.com';
  const blobStr = '/blob/';
  const srcPagesStr = '/src/pages/';
  const blobIndex = blobPath.indexOf(blobStr);
  const srcPagesIndex = blobPath.indexOf(srcPagesStr)

  // check pre-conditions

  const isValidRelativePath =
    blobPath.startsWith(githubPath)
    && blobIndex < srcPagesIndex
    && path.startsWith(pathPrefix);

  if(!isValidRelativePath) {
    // eslint-disable-next-line no-console
    console.error(`Invalid relative path "${path}" for "${blobPath}"`);
  }

  // build raw git URL

  const basePath = blobPath
    .substring(0, blobIndex)
    .replace(githubPath, 'https://raw.githubusercontent.com');

  const ref = blobPath.substring(blobIndex + blobStr.length, srcPagesIndex);
  const relativePath = path.replace(pathPrefix, '');

  return `${basePath}/${ref}/static${relativePath}`;
}

/**
 * Returns expected origin based on the host
 * @param {*} host The host
 * @param {*} suffix A suffix to append
 * @returns The expected origin
 */
export const setExpectedOrigin = (host, suffix = '') => {
  if (isLocalHostEnvironment(host)) {
    return `http://localhost:3000${suffix}`;
  }
  if (isStageEnvironment(host)) {
    return `https://developer-stage.adobe.com${suffix}`;
  }
  if (isHlxPath(host)) {
    return `${window.location.origin}${suffix}`;
  }
  if (isDevEnvironment(host)) {
    return `https://developer-dev.adobe.com${suffix}`;
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
  if (isLocalHostEnvironment(host)) {
    return 'http://localhost:8000';
  }
  if (isStageEnvironment(host) || isHlxPath(host)) {
    return `https://developer-stage.adobe.com${suffix}`;
  }
  if (isDevEnvironment(host)) {
    return `https://developer-dev.adobe.com${suffix}`;
  }
  return `https://developer.adobe.com${suffix}`;
};

/**
 * Returns the franklin closest sub folder
 * @param {*} host The host
 * @param {*} suffix A suffix to append
 * @returns The first subfolder in the franklin dir - for special urls like apis will return the franklin_assets folder
 */
export const getClosestFranklinSubfolder = (host, suffix = '', defaultNav = false) => {
  let subfolderPath = window.location.pathname.split('/')[1];

  // make sure top level paths point to the same nav if on these paths
  if (subfolderPath === '' || subfolderPath === 'apis' || subfolderPath === 'open' || subfolderPath === 'developer-support' || defaultNav) {
    subfolderPath = 'franklin_assets';
  } else {
    subfolderPath = window.location.pathname;
    // strip any ending slash
    if (subfolderPath.charAt(subfolderPath.length - 1) === '/') subfolderPath = subfolderPath.substring(0, subfolderPath.length - 1);
    // strip any leading slash
    if (subfolderPath.charAt(0) === '/') subfolderPath = subfolderPath.substring(1);
  }

  if (isLocalHostEnvironment(host)) {
    return `http://localhost:3000/${subfolderPath}/${suffix}`;
  }
  if (isStageEnvironment(host)) {
    return `https://developer-stage.adobe.com/${subfolderPath}/${suffix}`;
  }
  if (isHlxPath(host)) {
    return `${window.location.origin}/${subfolderPath}/${suffix}`;
  }
  if (isDevEnvironment(host)) {
    return `https://developer-dev.adobe.com/${subfolderPath}/${suffix}`;
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

export function createAnchorLink(id) {
  const anchorLink = createTag('a', { class: 'anchor-link', href: `#${id}`, "aria-label": `${id}` });
  anchorLink.innerHTML = '<svg aria-hidden="true" height="18" viewBox="0 0 16 16" width="18">\n'
    + '                  <path d="M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z"></path>\n'
    + '                </svg>';
  return anchorLink;
}

/**
 * Decorates a header.
 * @param {Element} header The header element to add an anchor link.
 */
export function decorateAnchorLink(header) {
  //  block.querySelectorAll('h1, h2, h3, h4, h5, h6').forEach((h) => {
  const anchorLink = createAnchorLink(header.id);
  header.appendChild(anchorLink);
  // });
}

/**
 * Set the width of a block from Section Metadata.
 *
 * Nov 15th 2024: Removed from all blocks and will refactor in the future if there's demand.
 *
 * @param {Element} The element to add the width style to.
 */
export function applyWidthOverride(block) {
  const wid = block?.parentElement?.parentElement?.getAttribute('data-width');
  if (wid) {
    const widToInt = parseInt(wid.slice(0, wid.length - 2));
    if (widToInt >= 320 && widToInt <= 1920) block.style.width = wid;
  }
}

/**
 * set the background color of a block from Section Metadata
 *
 *
 * Dec 3rd 2024: Removed from all blocks and will refactor in the future if there's demand.
 *
 * @param {Element} The element to add the background color style to.
 */
export function applyBkgColorOverride(block) {
  const color = block?.parentElement?.parentElement?.getAttribute('data-backgroundcolor');
  if (color == 'white') {
    block.parentElement.parentElement.style.backgroundColor = color;
  } else if (color == 'navy') {
    block.parentElement.parentElement.style.backgroundColor = 'rgb(15, 55, 95)';
  }
  // Support the old style
  if (block.parentElement.parentElement.classList.contains('background-color-white')) {
    block.parentElement.parentElement.style.backgroundColor = 'white';
  }
}

export async function loadCustomAnalytic(domObj, path) {
  const resp = await fetch(`${path}.json`);
  if (resp.ok) {
    const analyticInfo = await resp.json();
    analyticInfo?.data.forEach(item => {
      const className = item.class;
      const href = item.href;
      const daalh = item["daa-lh"];
      const daall = item["daa-ll"];
      domObj.querySelectorAll('a').forEach((a) => {
        if (a.href === href) {
          a.setAttribute('daa-ll', daall);
          const sectionElement = a.closest('.section');
          if (sectionElement) {
            sectionElement.classList.add(className);
            sectionElement.querySelector('.block')?.setAttribute('daa-lh', daalh);
          }
        }
      });
    })
  }
}

/**
 * Add analytics to the page.  Check if an 'analytic' file exists, then read the custom analytic tracking data from the file.
 * @param {Element} The element to set the analytic heading attribute.
 */
export async function applyAnalytic(domObj = document) {
  domObj.querySelectorAll('a').forEach((a) => {
    if (a.innerText.length > 0) {
      a.setAttribute('daa-ll', a.innerText);
    }
  });
  let analyticPath = getClosestFranklinSubfolder(window.location.origin, 'analytic');
  if (analyticPath) {
    const analytic = await loadCustomAnalytic(domObj, analyticPath);
  }
}

/**
 * @returns Fetches the devsitePath.json file
 */
export async function getdevsitePathFile() {
  let devsitePath = `${window.location.origin}/franklin_assets/devsitepaths.json`;
  const resp = await fetch(devsitePath);
  if (resp.ok) {
    const devsitePath = await resp.json();
    return devsitePath;
  } else {
    return null;
  }
};

/**
 * @returns Fetches and redirects page based on redirects.json
 */
export async function redirect() {

  let devsitePaths = await getdevsitePathFile();

  if(devsitePaths) {
    const suffixSplit = window.location.pathname.split('/');
    let suffixSplitRest = suffixSplit.slice(1);

    let devsitePathMatch;
    let devsitePathMatchFlag = false;

    // find match based on level 3, 2, or 1 transclusion rule
    // if match found in higher level don't do lower level
    if (suffixSplit.length > 2) {
      devsitePathMatch = devsitePaths.data.find((element) => element.pathPrefix === `/${suffixSplit[1]}/${suffixSplit[2]}/${suffixSplit[3]}`);
      devsitePathMatchFlag = !!devsitePathMatch;
      if (devsitePathMatchFlag) {
        suffixSplitRest = suffixSplit.slice(4);
      }
    }
    if (suffixSplit.length > 1 && !devsitePathMatchFlag) {
      devsitePathMatch = devsitePaths.data.find((element) => element.pathPrefix === `/${suffixSplit[1]}/${suffixSplit[2]}`);
      devsitePathMatchFlag = !!devsitePathMatch;
      if (devsitePathMatchFlag) {
        suffixSplitRest = suffixSplit.slice(3);
      }
    }
    if (suffixSplit.length > 0 && !devsitePathMatchFlag) {
      devsitePathMatch = devsitePaths.data.find((element) => element.pathPrefix === `/${suffixSplit[1]}`);
      devsitePathMatchFlag = !!devsitePathMatch;
      if (devsitePathMatchFlag) {
        suffixSplitRest = suffixSplit.slice(2);
      }
    }

    if (devsitePathMatch) {
      console.log(`Matched pathPrefix: ${devsitePathMatch.pathPrefix}`);

      let redirectPath = `https://${window.location.hostname}${devsitePathMatch.pathPrefix}/redirects.json`;
      console.log(`redirectPath ${redirectPath}`)
      const resp = await fetch(redirectPath);
      if (resp.ok) {
        const redirectList = await resp.json();
        // apply redirect
        redirectList.data.forEach((redirect) => {
          if(window.location.pathname === redirect?.Source) {
            window.location.pathname = redirect?.Destination
          }
        });
      } else {
        return null;
      }
    }
  }
}
