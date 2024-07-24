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
    teaserContainer.style.padding = '4% 0%';

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
  const alignitems = block?.parentElement?.parentElement?.getAttribute('data-alignitems');

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
    if(alignitems){
      p.style.color = '#e2caf1';
    }
  });
  block.querySelectorAll('a').forEach((a) => {
    if (a.title === "Learn more" || "Explore more") {
      a.className = "spectrum-Button spectrum-Button--fill spectrum-Button--accent spectrum-Button--sizeM"

      block.querySelectorAll('.teaser > div').forEach((div) => {
        div.style.justifyContent = 'center';
        div.style.marginLeft = '0px';
      })
      block.querySelectorAll('.teaser > div > div').forEach((div) => {
        div.style.width = 'auto';
        if (alignitems) {
          div.style.alignItems = alignitems;
          div.style.gap = '20px';
        }
      })
    }
    if (a.title === "Try an add-on") {
      a.className = "spectrum-Button spectrum-Button--sizeM spectrum-Button--outline spectrum-Button--secondary"
      block.querySelectorAll('a > .spectrum-Button-label').forEach((div) => {
        if (div.textContent === 'Try an add-on') {
          div.style.color = 'white'
        }
      })
    }
  });
  applyBkgColorOverride(block);
  applyWidthOverride(block);
  applyAnalyticHeaderOverride(block);
  rearrangeLinks(block);
  setBackgroundImage(block);
}
