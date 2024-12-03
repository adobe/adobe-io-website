import {
  decorateLightOrDark,
  readBlockConfig,
  toClassName,
  sectionIsDark,
} from '../../scripts/lib-helix.js';
import {
  getBlockSectionContainer,
  createTag,
  focusRing,
} from '../../scripts/lib-adobeio.js';

// The list of current API filters
const CURRENT_API_FILTERS = [];

/**
 * Sorts per last updated date
 * @param {*} a The first last updated date
 * @param {*} b The second last updated date
 * @returns -1 if a is after b, 1 if b is after a, 0 otherwise
 */
function sortDate(a, b) {
  if (a['Last Updated'] > b['Last Updated']) {
    return -1;
  }
  if (a['Last Updated'] < b['Last Updated']) {
    return 1;
  }
  return 0;
}

/**
 * Sorts per title in alphabetical order
 * @param {*} a The first title
 * @param {*} b The second title
 * @returns -1 if a is before b, 1 if b before a, 0 otherwise
 */
function sortTitle(a, b) {
  if (a.Title < b.Title) {
    return -1;
  }
  if (a.Title > b.Title) {
    return 1;
  }
  return 0;
}

/**
 * Decorates h and p tags contained within a given element
 * @param {*} container The containing element
 * @param {*} containerClass The class to apply to the containing element
 */
function decorateTitle(container, containerClass) {
  // search container for h's and p's not inside a container and apply title block classes
  container.querySelectorAll('p').forEach((pTag) => {
    const mainContainer = container.querySelector(`'div.'${containerClass}`);
    if (!mainContainer.contains(pTag)) {
      pTag.classList.add('title-body', 'spectrum-Body--sizeL', 'spectrum-Body--light');
    }
  });
  container.querySelectorAll('h1, h2, h3, h4, h5, h6').forEach((hTag) => {
    const mainContainer = container.querySelector(`'div.'${containerClass}`);
    if (!mainContainer.contains(hTag)) {
      hTag.classList.add('title-header', 'spectrum-Heading--sizeL', 'spectrum-Heading--light');
    }
  });
}

/**
 * Converts API links into relative paths
 * @param {*} link the API link to convert
 * @returns the API link converted to a relative path
 */
function makeApiLinkRelative(link) {
  if (link) {
    if (link.indexOf('https://developer.adobe.com/apis') >= 0) {
      if (window.location.pathname === '/apis') {
        return link.replace('https://developer.adobe.com/apis', 'apis/');
      }
      if (window.location.pathname === '/apis/') {
        return link.replace('https://developer.adobe.com/apis', './');
      }
    }
    if (link.indexOf('https://developer.adobe.com') >= 0) {
      return link.replace('https://developer.adobe.com', '..');
    }
  }
  return link;
}

/**
 * Displays filtered APIs as filtered cards
 * @param {*} catalog The catalog of APIs/cards
 * @param {*} cards   The container element
 * @param {*} buttons The buttons to add to each card
 * @param {*} limit The number of cards in the catalog
 */
function displayFilteredCards(catalog, cards, buttons, limit, lightOrDarkCssClass) {
  let cardsInnerHTML = '';
  let counter = 0;
  catalog.forEach((card) => {
    let show = true;
    if (CURRENT_API_FILTERS.length > 0) {
      if (!CURRENT_API_FILTERS.includes(card.Category)) show = false;
    }
    if (counter >= limit) {
      show = false;
    }
    if (show) {
      let iconTemplate = '';
      if (card.Icon) {
        iconTemplate = `
          <div class="api-card-icon-container">
            <img
              width="48px"
              height="48px"
              class="api-card-icon"
              src="/hlx_statics/icons/${card.Icon}.svg"
              alt=""
            />
          </div>
        `;
      }
      let buttonTemplate = '';
      buttons.forEach((b) => {
        if (card[b] !== '') {
          let link;
          if (b === 'Learn More') {
            link = makeApiLinkRelative(card[b]);
            buttonTemplate
              += `<a href="${link}" class="spectrum-Button spectrum-Button--fill spectrum-Button--secondary spectrum-Button--outline spectrum-Button--sizeM" id="${(card.Title).replace(/\s/g, '')}-lm" aria-labelledby="${(card.Title).replace(/\s/g, '')}-lm ${(card.Title).replace(/\s/g, '')}">
                <span class="spectrum-Button-label">${b}</span>
              </a>`;
          } else {
            link = makeApiLinkRelative(card[b]);
            buttonTemplate
              += `
                <a href="${link}" class="spectrum-Button spectrum-Button--outline spectrum-Button--primary spectrum-Button--sizeM" id="${(card.Title).replace(/\s/g, '')}-vd" aria-labelledby="${(card.Title).replace(/\s/g, '')}-vd ${(card.Title).replace(/\s/g, '')}">
                  <span class="spectrum-Button-label">${b}</span>
                </a>
              `;
          }
        }
      });

      const cardTemplate = `
        <div class="api-card ${lightOrDarkCssClass}">
          <div class="spectrum-Card api-card-inner" tabindex="0">
            <div class="spectrum-Card-body api-card-body" daa-lh="browser card">
              ${iconTemplate}
              <div class="api-card-body-inner">
                <div class="api-card-title-container spectrum-Card-header spectrum-Heading spectrum-Heading--sizeXXS">
                  <div class="api-card-title spectrum-Card-title">
                    <strong><h4 id=${(card.Title).replace(/\s/g, '')}>${card.Title}</h4></strong>
                  </div>
                </div>
                <div class="spectrum-Card-content spectrum-Body spectrum-Body--sizeS api-card-content">
                  ${card.Description}
                </div>
              </div>
            </div>
            <div class="spectrum-Card-footer">
              <div class="api-card-button-container">
                ${buttonTemplate}
              </div>
            </div>
          </div>
        </div>`;
      cardsInnerHTML += cardTemplate;
      counter += 1;
    }
  });
  cards.innerHTML = cardsInnerHTML;
}

/**
 * loads and decorates the api browser
 * @param {Element} block The api browser block element
 */
export default async function decorate(block) {
  const sectionContainer = getBlockSectionContainer(block);
  decorateTitle(sectionContainer, 'api-browser');

  decorateLightOrDark(block);

  const config = readBlockConfig(block);
  window.aio = {};
  const resp = await fetch('/hlx-api-catalog.json');
  window.aio.apiCatalog = (await resp.json()).data;
  const catalog = window.aio.apiCatalog;
  let buttons = ['Learn More', 'View Docs'];
  if (config.display) {
    buttons = config.display.split(',').map((e) => e.trim());
  }
  block.innerHTML = '';
  if (config.filters === 'Show') {
    const categories = catalog.map((e) => e.Category).filter((v, i, self) => self.indexOf(v) === i);
    const cards = createTag('div', { class: 'api-cards' });
    const apiCardsInner = createTag('div', { class: 'api-cards-inner' });
    const filters = createTag('div', { class: 'filters' });

    const pickerContainer = createTag('div', { class: 'picker' });
    block.append(pickerContainer);
    const pickerHtml = `
      <div role="group" aria-labelledby="sortby-label" class="sort-group">
      <p id="sortby-label" class="sort-by-label">Sort by</p>
      <button  id="filter-dropdown-picker" class="spectrum-Picker spectrum-Picker--sizeM spectrum-Picker--quiet" aria-haspopup="listbox" aria-expanded="false">
          <span id="filter-label" class="spectrum-Picker-label">Last updated</span>
          <svg class="spectrum-Icon spectrum-UIIcon-ChevronDown100 spectrum-Picker-menuIcon" focusable="false" aria-hidden="true">
            <use xlink:href="./hlx_statics/styles/spectrum/spectrum-css-icon-Chevron100.svg#ChevronSize100" />
          </svg>
      </button>
      <div id="filter-dropdown-popover" class="spectrum-Popover spectrum-Popover--bottom spectrum-Picker-popover spectrum-Picker-popover--quiet filter-by-popover">
          <ul id="filter-list"class="spectrum-Menu" role="menu">
          <li id="filter-list-last-updated" class="spectrum-Menu-item is-selected" role="option" aria-selected="true" tabindex="0">
              <span class="spectrum-Menu-itemLabel">Last updated</span>
              <svg class="spectrum-Icon spectrum-UIIcon-Checkmark100 spectrum-Menu-checkmark spectrum-Menu-itemIcon" focusable="false" aria-hidden="true">
                <use xlink:href="./hlx_statics/styles/spectrum/spectrum-css-icon-Checkmark100.svg#CheckmarkSize100" />
              </svg>
          </li>
          <li id="filter-list-name" class="spectrum-Menu-item" role="option" tabindex="0">
              <span class="spectrum-Menu-itemLabel">Name</span>
              <svg class="spectrum-Icon spectrum-UIIcon-Checkmark100 spectrum-Menu-checkmark spectrum-Menu-itemIcon" focusable="false" aria-hidden="true">
                <use xlink:href="./hlx_statics/styles/spectrum/spectrum-css-icon-Checkmark100.svg#CheckmarkSize100" />
              </svg>
          </li>
          </ul>
     </div>
     </div>
    `;

    pickerContainer.innerHTML = pickerHtml;

    const dropdownPicker = block.querySelector('#filter-dropdown-picker');
    const dropdownPopover = block.querySelector('#filter-dropdown-popover');

    dropdownPicker.addEventListener('click', (evt) => {
      if (!evt.currentTarget.classList.contains('is-open')) {
        dropdownPicker.classList.add('is-open');
        dropdownPicker.ariaExpanded = true;
        dropdownPopover.classList.add('is-open');
        dropdownPopover.ariaHidden = false;
      } else {
        dropdownPicker.classList.remove('is-open');
        dropdownPicker.ariaExpanded = false;
        dropdownPopover.classList.remove('is-open');
        dropdownPopover.ariaHidden = true;
      }
    });

    const filterLabel = document.querySelector('#filter-label');
    const filterListLastUpdated = document.querySelector('#filter-list-last-updated');
    const filterListName = document.querySelector('#filter-list-name');
    const lightOrDarkCssClass = sectionIsDark(block) ? 'spectrum--darkest' : 'spectrum--lightest';

    const lastUpdateHandler = function() {
      if (!filterListLastUpdated.classList.contains('is-selected')) {
        filterListLastUpdated.classList.add('is-selected');
        filterListLastUpdated.ariaSelected = true;
        filterListName.classList.remove('is-selected');
        filterListName.ariaSelected = false;
        filterLabel.innerText = 'Last updated';
        dropdownPicker.classList.remove('is-open');
        dropdownPopover.classList.remove('is-open');
        dropdownPopover.ariaHidden = true;
        dropdownPicker.ariaExpanded = false;
        displayFilteredCards(
          catalog.sort(sortDate),
          cards,
          buttons,
          config.limit,
          lightOrDarkCssClass,
        );
      }
    }

    const nameHandler = function() {
      if (!filterListName.classList.contains('is-selected')) {
        filterListLastUpdated.classList.remove('is-selected');
        filterListLastUpdated.ariaSelected = false;
        filterListName.classList.add('is-selected');
        filterListName.ariaSelected = true;
        filterLabel.innerText = 'Name';
        dropdownPicker.classList.remove('is-open');
        dropdownPopover.classList.remove('is-open');
        dropdownPopover.ariaHidden = true;
        dropdownPicker.ariaExpanded = false;
        displayFilteredCards(
          catalog.sort(sortTitle),
          cards,
          buttons,
          config.limit,
          lightOrDarkCssClass,
        );
      }
    }

    filterListLastUpdated.addEventListener('keydown', lastUpdateHandler);
    filterListLastUpdated.addEventListener('click', lastUpdateHandler);

    filterListName.addEventListener('keydown', nameHandler);
    filterListName.addEventListener('click', nameHandler);

    apiCardsInner.append(filters);

    let filterHtml = '';
    categories.forEach((c) => {
      const id = toClassName(c);

      filterHtml += `
        <label class="spectrum-Checkbox spectrum-Checkbox--emphasized spectrum-Checkbox--sizeM" for="${id}">
          <input type="checkbox" class="spectrum-Checkbox-input" id="${id}" name="${id}" value="${c}">
          <span class="spectrum-Checkbox-box">
            <svg class="spectrum-Icon spectrum-UIIcon-Checkmark100 spectrum-Checkbox-checkmark" focusable="false" aria-hidden="true">
              <use xlink:href="./hlx_statics/styles/spectrum/spectrum-css-icon-Checkmark100.svg#CheckmarkSize100" />
            </svg>
            <svg class="spectrum-Icon spectrum-UIIcon-Dash100 spectrum-Checkbox-partialCheckmark" focusable="false" aria-hidden="true">
              <use xlink:href="./hlx_statics/styles/spectrum/spectrum-css-icon-Dash100.svg#DashSize100" />
            </svg>
          </span>
          <span class="spectrum-Checkbox-label filter-label">${c}</span>
        </label>`;
    });

    const filtersTemplate = `
      <div role="group" aria-labelledby="group-label" class="filters-inner">
        <strong><h4 id="group-label" class="spectrum-Heading--sizeXS">Filter by</h4></strong>
        <div class="filters-list">
          ${filterHtml}
        </div>
      </div>`;

    filters.innerHTML = filtersTemplate;
    apiCardsInner.append(cards);
    block.append(apiCardsInner);

    displayFilteredCards(catalog, cards, buttons, config.limit, lightOrDarkCssClass);

    document.querySelectorAll('.filters-list input').forEach((filterItem) => {
      filterItem.addEventListener('change', (evt) => {
        if (evt.currentTarget.checked) {
          if (CURRENT_API_FILTERS.indexOf(evt.currentTarget.value) < 0) {
            CURRENT_API_FILTERS.push(evt.currentTarget.value);
          }
        } else {
          CURRENT_API_FILTERS.splice(CURRENT_API_FILTERS.indexOf(evt.currentTarget.value), 1);
        }
        displayFilteredCards(catalog, cards, buttons, config.limit, lightOrDarkCssClass);
      });
    });
    focusRing(block);
  }  
}
