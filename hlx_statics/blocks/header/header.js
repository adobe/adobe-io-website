import {
  createTag,
  setActiveTab,
  focusRing,
  isDevEnvironment,
  isTopLevelNav,
  getFranklinFirstSubFolder,
  setSearchFrameOrigin,
  setQueryStringParameter,
  getQueryString,
} from '../../scripts/lib-adobeio.js';
import { readBlockConfig } from '../../scripts/lib-helix.js';

function globalNavSearchButton() {
  const div = createTag('div', { class: 'nav-console-search-button' });
  div.innerHTML = `<button class="nav-dropdown-search" class="spectrum-ActionButton spectrum-ActionButton--sizeM spectrum-ActionButton--emphasized spectrum-ActionButton--quiet">
      <svg class="spectrum-Icon spectrum-Icon--sizeM" focusable="false" aria-hidden="true" aria-label="Edit">
        <use href="/hlx_statics/icons/search.svg#spectrum-icon-24-Search"></use>
      </svg>
    </button>`;
  return div;
}

function globalConsoleButton() {
  const div = createTag('div', { class: 'nav-console-button' });
  div.innerHTML = `<a href="https://developer.adobe.com/console/" class="spectrum-Button spectrum-Button--secondary  spectrum-Button--sizeM">
    <span class="spectrum-Button-label">
      Console
    </span>
  </a>`;
  return div;
}

function globalSignIn() {
  const div = createTag('div', { class: 'nav-sign-in' });
  div.innerHTML = `<button class="spectrum-ActionButton spectrum-ActionButton--sizeM spectrum-ActionButton--quiet">
    <span id="signIn" class="spectrum-ActionButton-label">Sign in</span>
  </button>`;
  return div;
}

function globalNavLinkItemDropdown(id, name, links) {
  return `
      <button id="nav-dropdown-button_${id}" class="spectrum-Picker spectrum-Picker--sizeM spectrum-Picker--quiet navigation-dropdown" aria-haspopup="listbox">
        <span class="spectrum-Picker-label">
          ${name}
        </span>
        <svg class="spectrum-Icon spectrum-UIIcon-ChevronDown100 spectrum-Picker-menuIcon" focusable="false" aria-hidden="true">
          <use xlink:href="#spectrum-css-icon-Chevron100" />
        </svg>
      </button>
      <div id="nav-dropdown-popover_${id}" class="spectrum-Popover spectrum-Popover--bottom spectrum-Picker-popover spectrum-Picker-popover--quiet filter-by-popover nav-dropdown-popover">
        <ul class="spectrum-Menu" role="menu">
          ${links}
        </ul>
      </div>
    `;
}

function globalNavLinkItemDropdownItem(url, name) {
  return `
      <li class="spectrum-Menu-item">
        <span class="spectrum-Menu-itemLabel"><a href="${url}" class="nav-dropdown-links">${name}</a></span>
      </li>
    `;
}

const globalNavSearchDropDown = () => createTag('div', { class: 'nav-console-search-frame' });

const setSearchFrameSource = () => {
  const src = isDevEnvironment(window.location.host) ? setSearchFrameOrigin(window.location.host) : `${setSearchFrameOrigin(window.location.host, '/search-frame')}`;
  const queryString = new URLSearchParams(window.location.search);
  return queryString && queryString.toString().length > 0
    ? `${src}?${queryString.toString()}`
    : src;
};

const searchFrameOnLoad = (renderedFrame, counter = 0, loaded) => {
  renderedFrame.contentWindow.postMessage(JSON.stringify({ localPathName: window.location.pathname }), '*');
  if (window.search_path_name_check !== window.location.pathname) {
    // attempt to establish connection for 3 seconds then time out
    if (counter > 30) {
      // eslint-disable-next-line no-console
      console.warn('Loading Search iFrame timed out');
      return;
    }
    window.setTimeout(() => { searchFrameOnLoad(renderedFrame, counter + 1, loaded); }, 100);
  }

  // Past this point we successfully passed the local pathname
  // and received a confirmation from the iframe
  if (!loaded) {
    const queryString = getQueryString();
    if (queryString) {
      let searchIframeContainer = document.querySelector('div.nav-console-search-frame');
      if(searchIframeContainer.length > 0){
        searchIframeContainer.style.visibility = 'visible';
      }
    }
  }

  loaded = true;
};

// Referenced https://stackoverflow.com/a/10444444/15028986
const checkIframeLoaded = (renderedFrame) => {
  // Get a handle to the iframe element
  const iframeDoc = renderedFrame.contentDocument || renderedFrame.contentWindow.document;

  // Check if loading is complete
  if (iframeDoc.readyState === 'complete') {
    renderedFrame.onload = () => {
      searchFrameOnLoad(renderedFrame);
    };
    // The loading is complete, call the function we want executed once the iframe is loaded
    return;
  }
  // If we are here, it is not loaded.
  // Set things up so we check the status again in 100 milliseconds
  window.setTimeout(checkIframeLoaded, 100);
};

function decorateSearchIframeContainer(header) {
  const searchIframeContainer = header.querySelector('div.nav-console-search-frame');
  const button = header.querySelector('button.nav-dropdown-search');
  const queryString = getQueryString();

  button.addEventListener('click', (evt) => {
    if (!evt.currentTarget.classList.contains('is-open')) {
      const searchFrame = createTag('iframe');
      searchFrame.id = 'nav-search-iframe';
      searchFrame.src = setSearchFrameSource();
      searchIframeContainer.appendChild(searchFrame);
      button.classList.add('is-open');
      /* Loading Iframe */
      checkIframeLoaded(searchIframeContainer.firstChild);
      searchIframeContainer.style.visibility = 'visible';
      document.body.style.overflow = 'hidden';
    } else {
      button.classList.remove('is-open');
      searchIframeContainer.style.visibility = 'hidden';
      document.body.style.overflow = 'auto';
      searchIframeContainer.firstChild.remove();
    }
  });

  // to load search if query string is present
  if (queryString) {
    button.click();
  }
}

function handleButtons(header) {
  header.querySelectorAll('button.navigation-dropdown').forEach((button) => {
    if (button.id.indexOf('nav-dropdown-button') >= 0) {
      const index = button.id.split('_')[1];
      const dropdownPopover = header.querySelector(`div#nav-dropdown-popover_${index}`);

      button.addEventListener('click', (evt) => {
        if (!evt.currentTarget.classList.contains('is-open')) {
          button.classList.add('is-open');
          dropdownPopover.classList.add('is-open');
          dropdownPopover.ariaHidden = false;
        } else {
          button.classList.remove('is-open');
          dropdownPopover.classList.remove('is-open');
          dropdownPopover.ariaHidden = false;
        }
      });
    } else if (button.id.indexOf('nav-profile-dropdown-button') >= 0) {
      const profileDropdownPopover = header.querySelector('div#nav-profile-dropdown-popover');
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
    }
  });
}

/**
 * Decorates the header
 * @param {*} block The header
 */
export default async function decorate(block) {
  const cfg = readBlockConfig(block);
  block.textContent = '';
  const navPath = cfg.nav || getFranklinFirstSubFolder(window.location.origin, 'nav');
  const resp = await fetch(`${navPath}.plain.html`);
  if (resp.ok) {
    const html = await resp.text();
    block.innerHTML = html;
    const header = block.parentElement;
    header.classList.add('main-header', 'global-nav-header');

    const iconContainer = createTag('p', { class: 'icon-adobe-container' });
    const title = block.querySelector('p:nth-child(1)');
    const siteLink = title.querySelector('strong > a');
    const iconLink = createTag('a', { class: 'na-console-adobeio-link', href: siteLink.href });
    iconLink.innerHTML = '<img class="icon icon-adobe" src="/hlx_statics/icons/adobe.svg" alt="adobe icon">';
    iconContainer.appendChild(iconLink);
    siteLink.className = 'nav-console-adobeio-link-text';
    siteLink.innerHTML = `<strong class="spectrum-Heading spectrum-Heading--sizeS icon-adobe-label">${siteLink.innerText}</strong>`;
    iconContainer.appendChild(siteLink);
    header.append(iconContainer);

    const ul = block.querySelector('ul');
    ul.setAttribute('id', 'navigation-links');
    ul.style.listStyleType = 'none';

    if (isTopLevelNav(window.location.pathname)) {
      const homeLink = ul.querySelector('li:nth-child(1)');
      homeLink.className = 'navigation-home';
    } else {
      const productsLi = ul.querySelector('li:nth-child(1)');
      productsLi.className = 'navigation-products';
    }

    ul.querySelectorAll('li > ul').forEach((dropDownList, index) => {
      let dropdownLinkDropdownHTML = '';
      let dropdownLinksHTML = '';

      dropDownList.querySelectorAll('ul > li > a').forEach((dropdownLinks) => {
        dropdownLinksHTML
          += globalNavLinkItemDropdownItem(dropdownLinks.href, dropdownLinks.innerText);
      });

      dropdownLinkDropdownHTML = globalNavLinkItemDropdown(
        index,
        dropDownList.parentElement.firstChild.textContent.trim(),
        dropdownLinksHTML,
      );
      dropDownList.parentElement.innerHTML = dropdownLinkDropdownHTML;
    });

    ul.querySelectorAll('a').forEach((a) => {
      if (a.parentElement.tagName === 'STRONG') {
        a.className = 'spectrum-Button spectrum-Button--secondary  spectrum-Button--sizeM';
        const span = createTag('span', { class: 'spectrum-Button-label' });
        span.innerText = a.innerText;
        a.innerText = '';
        a.appendChild(span);
        const li = a.parentElement.parentElement;
        const div = createTag('div', { class: 'nav-view-docs-button' });
        div.appendChild(a);
        ul.removeChild(li);
        ul.appendChild(div);
      }
    });

    window.search_path_name_check = '';

    window.addEventListener('message', (evt) => {
      const expectedOrigin = setSearchFrameOrigin(window.location.host);
      if (evt.origin !== expectedOrigin) return;
      try {
        const message = typeof evt.data === 'string' ? JSON.parse(evt.data) : evt.data;
        if (message.query) {
          setQueryStringParameter('query', message.query);
          setQueryStringParameter('keywords', message.keywords);
          setQueryStringParameter('index', message.index);
        } else if (message.received) {
          window.search_path_name_check = message.received;
        }
      } catch (e) {
        // eslint-disable-next-line no-console
        console.error(e);
      }
    });

    header.append(ul);
    const rightContainer = createTag('div', { class: 'nav-console-right-container' });
    rightContainer.appendChild(globalNavSearchButton());
    rightContainer.appendChild(globalConsoleButton());
    rightContainer.appendChild(globalSignIn());
    header.append(rightContainer);
    header.append(globalNavSearchDropDown());
    decorateSearchIframeContainer(header);
    block.remove();

    handleButtons(header);

    const signIn = header.querySelector('#signIn');
    signIn?.addEventListener('click', () => {
      window.adobeIMSMethods?.signIn();
    });

    setActiveTab();
    focusRing(header);
  }
}
