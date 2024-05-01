import {
  sampleRUM,
  buildBlock,
  decorateBlock,
  loadBlock,
  decorateButtons,
  decorateIcons,
  decorateSections,
  decorateBlocks,
  decorateTemplateAndTheme,
  waitForLCP,
  loadBlocks,
  loadCSS,
  addFavIcon,
  getMetadata,
  toCamelCase,
  toClassName,
} from './lib-helix.js';

import {
  buildEmbeds,
  toggleScale,
  decorateAnchorLink,
} from './lib-adobeio.js';

export {
  sampleRUM,
  toCamelCase,
  toClassName,
  getMetadata,
  loadCSS,
};

/*
 * ------------------------------------------------------------
 * Edit above at your own risk
 * ------------------------------------------------------------
 */

window.hlx = window.hlx || {};
window.adobeid = window.adobeid || {};

const LCP_BLOCKS = []; // add your LCP blocks to the list
window.hlx.RUM_GENERATION = 'project-1'; // add your RUM generation information here

sampleRUM('top');

window.addEventListener('load', () => sampleRUM('load'));

window.addEventListener('unhandledrejection', (event) => {
  sampleRUM('error', { source: event.reason.sourceURL, target: event.reason.line });
});

window.addEventListener('error', (event) => {
  sampleRUM('error', { source: event.filename, target: event.lineno });
});

window.addEventListener('resize', toggleScale);

function loadHeader(header) {
  const headerBlock = buildBlock('header', '');
  header.append(headerBlock);
  decorateBlock(headerBlock);
  loadBlock(headerBlock);
}

function loadFooter(footer) {
  const footerBlock = buildBlock('footer', '');
  footer.append(footerBlock);
  decorateBlock(footerBlock);
  loadBlock(footerBlock);
}

/**
 * Builds all synthetic blocks in a container element.
 * @param {Element} main The container element
 */

function buildAutoBlocks(main) {
  try {
    buildEmbeds(main);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Auto Blocking failed', error);
  }
}

/**
 * Decorates the main element.
 * @param {Element} main The main element
 */
// eslint-disable-next-line import/prefer-default-export
export function decorateMain(main) {
  // hopefully forward compatible button decoration
  decorateButtons(main);
  buildAutoBlocks(main);
  decorateSections(main);
  decorateBlocks(main);
}

/**
 * Decorates the html element.
 * @param {*} html The html element
 */
function decorateHTML(html) {
  html.className = 'spectrum spectrum--light spectrum--medium';
  html.dir = 'ltr';
  html.lang = 'en';
}

/**
 * loads everything needed to get to LCP.
 */
async function loadEager(doc) {
  const experiment = getMetadata('experiment');
  const instantExperiment = getMetadata('instant-experiment');
  if (instantExperiment || experiment) {
    // eslint-disable-next-line import/no-cycle
    const { runExperiment } = await import('./experimentation.js');
    await runExperiment(experiment, instantExperiment);
  }

  decorateTemplateAndTheme();
  const html = doc.querySelector('html');
  if (html) {
    decorateHTML(html);
  }
  toggleScale();
  const main = doc.querySelector('main');
  if (main) {
    decorateMain(main);
    await waitForLCP(LCP_BLOCKS);
  }
}

/**
 * loads everything that doesn't need to be delayed.
 */
async function loadLazy(doc) {
  const main = doc.querySelector('main');
  await loadBlocks(main);
  const { hash } = window.location;
  const element = hash ? doc.getElementById(hash.substring(1)) : false;
  if (hash && element) element.scrollIntoView();

  loadHeader(doc.querySelector('header'));
  decorateIcons(main);
  loadFooter(doc.querySelector('footer'));

  loadCSS(`${window.hlx.codeBasePath}/styles/lazy-styles.css`);
  addFavIcon(`/hlx_statics/icons/adobe.svg`);
  sampleRUM('lazy');
  sampleRUM.observe(main.querySelectorAll('div[data-block-name]'));
  sampleRUM.observe(main.querySelectorAll('picture > img'));

  if (window.location.hostname.endsWith('hlx.page') || window.location.hostname === ('localhost')) {
    // eslint-disable-next-line import/no-cycle
    import('../../tools/preview/experimentation-preview.js');
  }
}

/**
 * loads everything that happens a lot later, without impacting
 * the user experience.
 */
function loadDelayed() {
  // eslint-disable-next-line import/no-cycle
  window.setTimeout(() => import('./delayed.js'), 500);
  // load anything that can be postponed to the latest here
}

async function loadPage() {
  await loadEager(document);
  await loadLazy(document);
  loadDelayed(document);
}

loadPage();
