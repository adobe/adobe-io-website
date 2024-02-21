import {
  decorateButtons,
  applyAnalyticHeaderOverride,
} from '../../scripts/lib-adobeio.js';
import { decorateLightOrDark } from '../../scripts/lib-helix.js';

/**
 * Rearranges the links into a hero-button-container div
 * @param {*} block The hero block element
 */
function rearrangeLinks(block) {
  const leftDiv = block.firstElementChild.firstElementChild;
  const heroButtonContainer = document.createElement('div');
  heroButtonContainer.classList.add('hero-button-container');
  leftDiv.querySelectorAll('p.button-container').forEach((p) => {
    heroButtonContainer.append(p);
  });
  leftDiv.append(heroButtonContainer);
}

/**
 * decorates the hero
 * @param {Element} block The hero block element
 */
export default async function decorate(block) {
  block.setAttribute('daa-lh', 'hero');
  // Block decoration
  decorateLightOrDark(block, true);
  // H1 decoration
  block.querySelectorAll('h1, h2, h3, h4, h5, h6').forEach((h) => {
    const fontFamily = block?.parentElement?.parentElement?.getAttribute('data-font-family');
    if (fontFamily) {
      h.style.fontFamily = fontFamily;
      h.classList.add('spectrum-Heading', 'spectrum-Heading--sizeXXL');
    } else {
      h.classList.add('spectrum-Heading', 'spectrum-Heading--sizeXXL', 'spectrum-Heading--serif');
    }

  });

  block.querySelectorAll('picture source').forEach((picture) => {
    // Removes weird max-width attribute
    picture.media = '';
  });

  // Removes content for span.icon
  block.querySelectorAll('span.icon').forEach((span) => {
    span.textContent = '';
  });
  // Link decoration
  rearrangeLinks(block);
  decorateButtons(block);
  // Paragraph decoration
  block.querySelectorAll('p').forEach((p) => {
    if (p.innerText) {
      p.classList.add('spectrum-Body', 'spectrum-Body--sizeL');
    }
  });
  applyAnalyticHeaderOverride(block);
}
