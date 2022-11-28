import {
  createTag,
  setActiveTab,
  focusRing,
  isDevEnvironment,
  setExpectedOrigin,
} from '../../scripts/lib-adobeio.js';
import { readBlockConfig } from '../../scripts/lib-helix.js';

function globalNavSearchButton() {
  const div = createTag('div', { class: 'nav-console-search-button' });
  div.innerHTML = `<button class="nav-dropdown-search" class="spectrum-ActionButton spectrum-ActionButton--sizeM spectrum-ActionButton--emphasized spectrum-ActionButton--quiet">
      <svg class="spectrum-Icon spectrum-Icon--sizeM" focusable="false" aria-hidden="true" aria-label="Edit">
        <use href="/icons/search.svg#spectrum-icon-24-Search"></use>
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

const globalNavSearchDropDown = () => createTag('div', { class: 'nav-console-search-frame' });

const setSearchFrameSource = () => {
  const src = isDevEnvironment(window.location.host) ? setExpectedOrigin(window.location.host) : `${setExpectedOrigin(window.location.host, '/search-frame')}`;
  const queryString = new URLSearchParams(window.location.search);
  return queryString && queryString.toString().length > 0
    ? `${src}?${queryString.toString()}`
    : src;
};

function decorateSearchIframeContainer(header) {
  const searchIframeContainer = header.querySelector('div.nav-console-search-frame');
  const button = header.querySelector('button.nav-dropdown-search');
  button.addEventListener('click', (evt) => {
    if (!evt.currentTarget.classList.contains('is-open')) {
      const searchFrame = createTag('iframe');
      searchFrame.id = 'nav-search-iframe';
      searchFrame.src = setSearchFrameSource();
      searchIframeContainer.appendChild(searchFrame);
      button.classList.add('is-open');
      searchIframeContainer.style.visibility = 'visible';
      document.body.style.overflow = 'hidden';
    } else {
      button.classList.remove('is-open');
      searchIframeContainer.style.visibility = 'hidden';
      document.body.style.overflow = 'auto';
    }
  });
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
  const navPath = cfg.nav || '/nav';
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
    iconLink.innerHTML = '<img class="icon icon-adobe" src="/icons/adobe.svg" alt="adobe icon">';
    iconContainer.appendChild(iconLink);
    siteLink.className = 'nav-console-adobeio-link-text';
    siteLink.innerHTML = `<strong class="spectrum-Heading spectrum-Heading--sizeS icon-adobe-label">${siteLink.innerText}</strong>`;
    iconContainer.appendChild(siteLink);
    header.append(iconContainer);

    const ul = block.querySelector('ul');
    ul.setAttribute('id', 'navigation-links');
    ul.style.listStyleType = 'none';
    const productsLi = ul.querySelector('li:nth-child(1)');
    productsLi.className = 'navigation-products';
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
