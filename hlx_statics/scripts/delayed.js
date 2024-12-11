// eslint-disable-next-line import/no-cycle
import { 
  sampleRUM, 
  loadCSS 
} from './lib-helix.js';
import {
  focusRing,
  isHlxPath,
  isStageEnvironment,
  decorateProfile,
  addExtraScript,
  addExtraScriptWithLoad,
  applyAnalytic
} from './lib-adobeio.js';

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
  loadCSS(`${window.hlx.codeBasePath}/styles/prism.css`);
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

// Core Web Vitals RUM collection
sampleRUM('cwv');

addExtraScript(document.body, 'https://www.adobe.com/marketingtech/main.min.js');
addExtraScript(document.body, 'https://wwwimages2.adobe.com/etc/beagle/public/globalnav/adobe-privacy/latest/privacy.min.js');

document.querySelectorAll('.embed').forEach((embed) => {
  const iframe = embed.querySelector('iframe');
  if (!iframe.src) {
    iframe.src = iframe.getAttribute('data-src');
    iframe.onload = () => { iframe.style.opacity = 1; };
  }
});

focusRing();
applyAnalytic();
loadPrism(document);