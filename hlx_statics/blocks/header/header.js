import {
  createTag,
  setActiveTab,
  focusRing,
  isDevEnvironment,
  isTopLevelNav,
  setSearchFrameOrigin,
  getClosestFranklinSubfolder,
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

function globalDistributeButton() {
  const div = createTag('div', { class: 'nav-console-distribute-button' });
  div.innerHTML = `<a href="/distribute" class="spectrum-Button spectrum-Button--cta spectrum-Button-fill  spectrum-Button--sizeM">
    <span class="spectrum-Button-label">
      Distribute
    </span>
  </a>`;
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

function globalMobileDistributeButton() {
  const div = createTag('div', { class: 'nav-mobile-distribute-button' });
  div.innerHTML = `<a href="/distribute" class="spectrum-Button spectrum-Button--cta spectrum-Button-fill  spectrum-Button--sizeM">
    <span class="spectrum-Button-label">
      Distribute
    </span>
  </a>`;
  return div;
}

function globalMobileConsoleButton() {
  const div = createTag('div', { class: 'nav-mobile-console-button' });
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
        <span class="spectrum-Picker-label nav-label">
          ${name}
        </span>
        <svg aria-hidden="true" role="img" focusable="false" class="spectrum-Icon spectrum-UIIcon-ChevronDown100 spectrum-Picker-menuIcon dropdown-icon">
          <path d="M4.5 13.25a1.094 1.094 0 01-.773-1.868L8.109 7 3.727 2.618A1.094 1.094 0 015.273 1.07l5.157 5.156a1.094 1.094 0 010 1.546L5.273 12.93a1.091 1.091 0 01-.773.321z" class="spectrum-UIIcon--large"></path>
          <path d="M3 9.95a.875.875 0 01-.615-1.498L5.88 5 2.385 1.547A.875.875 0 013.615.302L7.74 4.377a.876.876 0 010 1.246L3.615 9.698A.872.872 0 013 9.95z" class="spectrum-UIIcon--medium"></path>
         </svg>
      </button>
      <div id="nav-dropdown-popover_${id}" class="spectrum-Popover spectrum-Popover--bottom spectrum-Picker-popover spectrum-Picker-popover--quiet filter-by-popover nav-dropdown-popover">
        <ul class="spectrum-Menu" role="menu">
          ${links}
        </ul>
      </div>
      <div id="nav-dropdown-mobile-popover_${id}" class="nav-dropdown-mobile-popover">
        <ul class="nav-sub-menu spectrum-Menu" role="menu">
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
  const queryString = getQueryString();
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

    if (queryString.has('query')) {
      const searchIframeContainer = document.querySelector('div.nav-console-search-frame');
      if (searchIframeContainer.length > 0) {
        searchIframeContainer.style.visibility = 'visible';
      }
    }
  }

  loaded = true; // eslint-disable-line no-param-reassign
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
  if (queryString.has('query')) {
    button.click();
  }
}

function handleButtons(header) {
  header.querySelectorAll('button.navigation-dropdown').forEach((button) => {
    if (button.id.indexOf('nav-dropdown-button') >= 0) {
      const index = button.id.split('_')[1];
      const dropdownPopover = header.querySelector(`div#nav-dropdown-popover_${index}`);
      const dropdownMobilePopover = header.querySelector(`div#nav-dropdown-mobile-popover_${index}`);

      button.addEventListener('click', (evt) => {
        if (!evt.currentTarget.classList.contains('is-open')) {
          button.classList.add('is-open');
          dropdownPopover.classList.add('is-open');
          dropdownMobilePopover.classList.add('is-open');
          dropdownPopover.ariaHidden = false;
          dropdownMobilePopover.ariaHidden = false;
        } else {
          button.classList.remove('is-open');
          dropdownPopover.classList.remove('is-open');
          dropdownMobilePopover.classList.remove('is-open');
          dropdownPopover.ariaHidden = false;
          dropdownMobilePopover.ariaHidden = false;
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
  // strip out trailing slash if any
  const navPath = cfg.nav || getClosestFranklinSubfolder(window.location.origin, 'nav');
  const resp = await fetch(`${navPath}.plain.html`);
  if (resp.ok) {
    const html = await resp.text();
    block.innerHTML = html;
    const header = block.parentElement;
    header.classList.add('main-header', 'global-nav-header');
    header.setAttribute('daa-lh', 'header');

    const mobileButton = createTag('input', {class: 'menu-btn', type: 'checkbox', id:'menu-btn'});
    header.appendChild(mobileButton);
    const mobileMenu = createTag('label', {class: 'menu-icon', for: "menu-btn"} );
    mobileMenu.innerHTML = '<span class="navicon"></span>';
    header.appendChild(mobileMenu);
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
    ul.setAttribute('class', 'menu');
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

    let buttonDiv;
    if (window.location.pathname.includes("/developer-distribution")) {
      buttonDiv = createTag('div');
      ul.appendChild(buttonDiv);
      buttonDiv.appendChild(globalMobileDistributeButton());
    } else {
      buttonDiv = createTag('div', { class: 'button-container' });
      ul.appendChild(buttonDiv);
    }
    buttonDiv.appendChild(globalMobileConsoleButton());
    ul.querySelectorAll('a').forEach((a) => {
      if (a.parentElement.tagName === 'STRONG') {
        a.className = 'spectrum-Button spectrum-Button--secondary  spectrum-Button--sizeM';
        const span = createTag('span', { class: 'spectrum-Button-label' });
        span.innerHTML = a.innerHTML;
        a.innerHTML = '';
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
    if (window.location.pathname.includes("/developer-distribution")) {
      rightContainer.appendChild(globalDistributeButton());
    }
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
  } else if(resp.status == 404){
    const resp404 = await fetch(`https://developer.adobe.com/franklin_assets/nav.plain.html`);
      if (resp404.ok) {
        const html = await resp404.text();
        block.innerHTML = html;
        const header = block.parentElement;
        header.classList.add('main-header', 'global-nav-header');
        header.setAttribute('daa-lh', 'header');
    
        const mobileButton = createTag('input', {class: 'menu-btn', type: 'checkbox', id:'menu-btn'});
        header.appendChild(mobileButton);
        const mobileMenu = createTag('label', {class: 'menu-icon', for: "menu-btn"} );
        mobileMenu.innerHTML = '<span class="navicon"></span>';
        header.appendChild(mobileMenu);
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
        ul.setAttribute('class', 'menu');
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
    
        let buttonDiv;
        if (window.location.pathname.includes("/developer-distribution")) {
          buttonDiv = createTag('div');
          ul.appendChild(buttonDiv);
          buttonDiv.appendChild(globalMobileDistributeButton());
        } else {
          buttonDiv = createTag('div', { class: 'button-container' });
          ul.appendChild(buttonDiv);
        }
        buttonDiv.appendChild(globalMobileConsoleButton());
        ul.querySelectorAll('a').forEach((a) => {
          if (a.parentElement.tagName === 'STRONG') {
            a.className = 'spectrum-Button spectrum-Button--secondary  spectrum-Button--sizeM';
            const span = createTag('span', { class: 'spectrum-Button-label' });
            span.innerHTML = a.innerHTML;
            a.innerHTML = '';
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
        if (window.location.pathname.includes("/developer-distribution")) {
          rightContainer.appendChild(globalDistributeButton());
        }
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
}
