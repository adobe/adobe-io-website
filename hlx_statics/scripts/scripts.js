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
  buildCodes,
  buildEmbeds,
  buildHeadings,
  toggleScale,
  decorateAnchorLink,
  decorateInlineCodes,
  isHlxPath,
  addExtraScriptWithLoad,
  addExtraScript,
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
 * Loads prism for syntax highlighting
 * @param {Document} document
 */
function loadPrism(document) {
  const highlightable = document.querySelector(
    'code[class*="language-"], [class*="language-"] code',
  );
  if (!highlightable) return; // exit, no need to load prism if nothing to highlight

  // see: https://prismjs.com/docs/Prism.html#.manual
  window.Prism = window.Prism || {};
  window.Prism.manual = true;
  import('./prism.js')
    .then(() => {
      // see: https://prismjs.com/plugins/autoloader/
      window.Prism.plugins.autoloader.languages_path = '/hlx_statics/scripts/prism-grammars/';
      // run prism in async mode; uses webworker.
      window.Prism.highlightAll(true);
    })
  // eslint-disable-next-line no-console
    .catch((err) => console.error(err));
}

/**
 * Builds all synthetic blocks in a container element.
 * @param {Element} main The container element
 */

function buildAutoBlocks(main) {
  try {
    buildCodes(main);
    buildEmbeds(main);
    buildHeadings(main);
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
  decorateInlineCodes(main);
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

function setIMSParams(client_id, scope, environment, logsEnabled) {
  window.adobeid = {
    client_id: client_id,
    scope: scope, 
    locale: 'en_US',
    environment: environment,
    useLocalStorage: true,
    logsEnabled: logsEnabled,
    redirect_uri: window.location.href,
    isSignedIn: false,
    onError: (error) => {
      // eslint-disable-next-line no-console
      console.log(error);
    },
    onReady: () => {
      if (window.adobeIMSMethods.isSignedIn()) {
        window.dispatchEvent(imsSignIn);
        window.adobeIMSMethods.getProfile();
      }
      //not sure if the resolve should be here or the onError
      console.log('Adobe IMS Ready!');
      resolve(); // resolve the promise, consumers can now use window.adobeIMS
      clearTimeout(timeout);
    },
    onError: reject,
  };
}

window.adobeIMSMethods = {
  isSignedIn: () => window.adobeIMS.isSignedInUser(),
  signIn: () => {
    window.adobeIMS.signIn();
  },
  signOut() {
    window.adobeIMS.signOut({});
  },
  getProfile() {
    window.adobeIMS.getProfile().then((profile) => {
      window.adobeid.profile = profile;
      window.adobeid.profile.avatarUrl = '/hlx_statics/icons/avatar.svg';
      decorateProfile(window.adobeid.profile);
      fetchProfileAvatar(window.adobeid.profile.userId);
    })
      .catch((ex) => {
        window.adobeid.profile = ex;
      });
  },
};

export async function loadIms() {
  window.imsLoaded =
    window.imsLoaded ||
    new Promise((resolve, reject) => {
      const timeout = setTimeout(() => reject(new Error('IMS timeout')), 5000);
      
      // different IMS clients
      if (isHlxPath(window.location.host)) {
        const client_id = 'helix_adobeio';
        const scope = 'AdobeID,openid,read_organizations,additional_info.projectedProductContext,additional_info.roles,gnav,read_pc.dma_bullseye,creative_sdk';
        const environment = 'stg1';
        const logsEnabled = true;
        
        setIMSParams(client_id, scope, environment, logsEnabled);
        
        window.marketingtech = {
          adobe: {
            launch: {
              property: 'global',
              environment: 'dev',
            },
            analytics: {
              additionalAccounts: 'pgeo1xxpnwadobeio-qa',
            },
          },
        };
      } else if (!isHlxPath(window.location.host) && isStageEnvironment(window.location.host)) {

        if (window.location.pathname.includes('/photoshop/api')) {
          const client_id = 'cis_easybake';
          const scope = 'AdobeID,openid,creative_sdk,creative_cloud,unified_dev_portal,read_organizations,additional_info.projectedProductContext,additional_info.roles,gnav,read_pc.dma_bullseye';
          const environment = 'stg1';
          const logsEnabled = true;
        
          setIMSParams(client_id, scope, environment, logsEnabled);
          window.adobeid = {
            onReady: () => {
              if (window.adobeIMSMethods.isSignedIn()) {
                window.dispatchEvent(imsSignIn);
                window.adobeIMSMethods.getProfile();
              }
              //not sure if the resolve should be here or the onError
              console.log('Adobe IMS Ready!');
              resolve(); // resolve the promise, consumers can now use window.adobeIMS
              clearTimeout(timeout);
            },
            onError: reject,
          }
          
        } else {
          const client_id = 'stage_adobe_io';
          const scope = 'AdobeID,openid,unified_dev_portal,read_organizations,additional_info.projectedProductContext,additional_info.roles,gnav,read_pc.dma_bullseye,creative_sdk';
          const environment = 'stg1';
          const logsEnabled = true;
        
          setIMSParams(client_id, scope, environment, logsEnabled);
          window.adobeid = {
            onReady: () => {
              if (window.adobeIMSMethods.isSignedIn()) {
                window.dispatchEvent(imsSignIn);
                window.adobeIMSMethods.getProfile();
              }
              //not sure if the resolve should be here or the onError
              console.log('Adobe IMS Ready!');
              resolve(); // resolve the promise, consumers can now use window.adobeIMS
              clearTimeout(timeout);
            },
            onError: reject,
          }
        }
        
        window.marketingtech = {
          adobe: {
            launch: {
              property: 'global',
              environment: 'dev',
            },
            analytics: {
              additionalAccounts: 'pgeo1xxpnwadobeio-qa',
            },
          },
        };
      } else if (!isHlxPath(window.location.host) && !isStageEnvironment(window.location.host)) {
        if (window.location.pathname.includes('/photoshop/api')) {
          const client_id = 'cis_easybake';
          const scope = 'AdobeID,openid,creative_sdk,creative_cloud,unified_dev_portal,read_organizations,additional_info.projectedProductContext,additional_info.roles,gnav,read_pc.dma_bullseye';
          const environment = 'prod';
          const logsEnabled = false;
        
          setIMSParams(client_id, scope, environment, logsEnabled);
          window.adobeid = {
            onReady: () => {
              if (window.adobeIMSMethods.isSignedIn()) {
                window.dispatchEvent(imsSignIn);
                window.adobeIMSMethods.getProfile();
              }
              //not sure if the resolve should be here or the onError
              console.log('Adobe IMS Ready!');
              resolve(); // resolve the promise, consumers can now use window.adobeIMS
              clearTimeout(timeout);
            },
            onError: reject,
          }
        } else {
          const client_id = 'adobe_io';
          const scope = 'AdobeID,openid,unified_dev_portal,read_organizations,additional_info.projectedProductContext,additional_info.roles,gnav,read_pc.dma_bullseye,creative_sdk';
          const environment = 'prod';
          const logsEnabled = false;
        
          setIMSParams(client_id, scope, environment, logsEnabled);
          window.adobeid = {
            onReady: () => {
              if (window.adobeIMSMethods.isSignedIn()) {
                window.dispatchEvent(imsSignIn);
                window.adobeIMSMethods.getProfile();
              }
              //not sure if the resolve should be here or the onError
              console.log('Adobe IMS Ready!');
              resolve(); // resolve the promise, consumers can now use window.adobeIMS
              clearTimeout(timeout);
            },
            onError: reject,
          }
        }
        
        window.marketingtech = {
          adobe: {
            launch: {
              property: 'global',
              environment: 'production',
            },
            analytics: {
              additionalAccounts: 'pgeo1xxpnwadobeio-prod',
            },
          },
        };
      }
      // window.adobeid = {
      //   scope:
      //     'AdobeID,additional_info.company,additional_info.ownerOrg,avatar,openid,read_organizations,read_pc,session,account_cluster.read,pps.read',
      //   locale: locales.get(document.querySelector('html').lang) || locales.get('en'),
      //   ...ims,
      //   onReady: () => {
      //     // eslint-disable-next-line no-console
      //     console.log('Adobe IMS Ready!');
      //     resolve(); // resolve the promise, consumers can now use window.adobeIMS
      //     clearTimeout(timeout);
      //   },
      //   onError: reject,
      // };
      // loadScript('https://auth.services.adobe.com/imslib/imslib.min.js');

      //load scripts like above
      if (isHlxPath(window.location.host) || isStageEnvironment(window.location.host)) {
        addExtraScript(document.body, 'https://auth-stg1.services.adobe.com/imslib/imslib.js');
      } else {
        addExtraScript(document.body, 'https://auth.services.adobe.com/imslib/imslib.min.js');
      }
    });
  return window.imsLoaded;
}

/**
 * loads everything that doesn't need to be delayed.
 */
async function loadLazy(doc) {
  const main = doc.querySelector('main');
  loadIms();
  await loadBlocks(main);

  const { hash } = window.location;
  const element = hash ? doc.getElementById(hash.substring(1)) : false;
  if (hash && element) element.scrollIntoView();

  loadHeader(doc.querySelector('header'));
  decorateIcons(main);
  loadFooter(doc.querySelector('footer'));

  if (document.body.classList.contains('documentation')) {
    main.style.display = 'grid';
    main.style.gridTemplateAreas = '"sidenav main" "sidenav footer"';

    const sidenav = main.querySelector('.side-nav-container');
    if (sidenav) {
      // set whatever is the next section next to sidenav to be the documentation main content area
      sidenav.nextElementSibling.style.gridArea = 'main';
    }

    // rearrange footer and append to main when in doc mode
    const footer = doc.querySelector('footer');
    main.append(footer);
  }

  loadCSS(`${window.hlx.codeBasePath}/styles/lazy-styles.css`);
  addFavIcon('/hlx_statics/icons/adobe.svg');
  sampleRUM('lazy');
  sampleRUM.observe(main.querySelectorAll('div[data-block-name]'));
  sampleRUM.observe(main.querySelectorAll('picture > img'));

  if (window.location.hostname.endsWith('hlx.page') || window.location.hostname === ('localhost')) {
    // eslint-disable-next-line import/no-cycle
    import('../../tools/preview/experimentation-preview.js');
  }

  loadPrism(doc);
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
