import { decorateButtons, removeEmptyPTags, applyWidthOverride, applyBkgColorOverride, applyAnalyticHeaderOverride } from '../../scripts/lib-adobeio.js';

/**
 * Rearranges the links into a teaser-button-container div
 * @param {*} block The teaser block element
 */
function rearrangeLinks(block) {
  const leftDiv = block.firstElementChild.firstElementChild;
  const teaserblockButton = document.createElement('div');
  teaserblockButton.classList.add('teaser-button-container');
  leftDiv.querySelectorAll('p.button-container').forEach((p) => {
    teaserblockButton.append(p);
  });
  leftDiv.append(teaserblockButton);
}

/**
 * Sets the background image and hides the image wrapper div
 * @param {Element} block The teaser block element
 */
function setBackgroundImage(block) {
  const imageWrapper = block.querySelector('picture');
  const img = imageWrapper ? imageWrapper.querySelector('img') : null;

  if (img) {
    const src = img.src;
    const teaserContainer = block.closest('.teaser-container');
    teaserContainer.style.backgroundImage = `url('${src}')`;
    teaserContainer.style.backgroundSize = 'cover';
    teaserContainer.style.backgroundPosition = 'center';

    // Hide the image wrapper
    imageWrapper.parentElement.style.display = 'none';
  }
}

/**
 * Decorates the teaser
 * @param {Element} block The teaser block element
 */
export default async function decorate(block) {
  const fontcolor = block?.parentElement?.parentElement?.getAttribute('data-fontcolor');
  decorateButtons(block);
  removeEmptyPTags(block);
  block.setAttribute('daa-lh', 'teaser');
  block.querySelectorAll('h1, h2, h3, h4, h5, h6').forEach((h) => {
    h.classList.add('spectrum-Heading', 'spectrum-Heading--sizeL', 'teaser-heading');
    h.style.color = fontcolor;
  });
  block.querySelectorAll('p').forEach((p) => {
    p.classList.add('spectrum-Body', 'spectrum-Body--sizeL');
    p.style.color = fontcolor;
  });
  applyBkgColorOverride(block);
  applyWidthOverride(block);
  applyAnalyticHeaderOverride(block);
  rearrangeLinks(block);
  setBackgroundImage(block);
}
