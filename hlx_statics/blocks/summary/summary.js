import {
  decorateButtons,
  removeEmptyPTags,
  rearrangeHeroPicture,
  applyAnalyticHeaderOverride,
} from '../../scripts/lib-adobeio.js';

/**
 * decorates the summary
 * @param {Element} block The summary block element
 */
export default async function decorate(block) {
  block.setAttribute('daa-lh', 'summary');
  decorateButtons(block);
  removeEmptyPTags(block);
  block.classList.add('spectrum--dark');
  block.querySelectorAll('h2').forEach((h2) => {
    h2.classList.add('spectrum-Heading', 'spectrum-Heading--sizeL');
  });
  block.querySelectorAll('p').forEach((p) => {
    const hasLinks = p.querySelectorAll('a, button');
    // don't attach to icon container or if p tag contains links
    if (!p.classList.contains('icon-container') && hasLinks.length === 0) {
      p.classList.add('spectrum-Body', 'spectrum-Body--sizeL');
    } else if (hasLinks.length > 0) {
      p.classList.remove('button-container');
    }
    hasLinks.forEach((button) => {
      button.className = '';
      button.classList.add('spectrum-Button', 'spectrum-Button--secondary', 'spectrum-Button--sizeM', 'spectrum-Button--overBackground');
    });
  });
  const overlayStyle = 'position: absolute; display: flex; left: 0%; z-index: 1000;';
  rearrangeHeroPicture(block, overlayStyle);
  applyAnalyticHeaderOverride(block);
}
