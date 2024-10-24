import { decorateButtons, applyWidthOverride, applyBkgColorOverride, applySectionTitle, applyAnalyticHeaderOverride } from '../../scripts/lib-adobeio.js';
import { createOptimizedPicture, decorateLightOrDark } from '../../scripts/lib-helix.js';

/**
 * Generates optimized images for all cards in the block
 * @param {*} block The cards block
 */
function processImages(block) {
  block.querySelectorAll('picture > img').forEach((img) => {
    const parent = img.parentElement.parentElement;
    const imgSrc = img?.src;
    const altText = img?.alt;
    const picture = createOptimizedPicture(imgSrc, altText);
    parent.replaceChild(picture, img.parentElement);
  });
}

/**
 * loads and decorates the cards
 * @param {Element} block The cards block element
 */
export default async function decorate(block) {
  // by default, we will use all links as button.  When the section metadata added a linkstyle to be link, it'll change that section's button to be link.
  const isLink = block.parentElement.parentElement.getAttribute('data-link-class');
  const fontColor = block.parentElement.parentElement.getAttribute('data-fontColor');
  const padding = block?.parentElement?.parentElement?.getAttribute('data-padding');
  if (padding) {
    block.querySelectorAll('.cards > div').forEach((div) => {
      div.style.padding = padding;
    })
  }
  if (isLink !== "link") {
    decorateButtons(block);
  }
  block.setAttribute('daa-lh', 'card');
  block.querySelectorAll('.cards > div').forEach((card, index, array) => {

    decorateLightOrDark(block);

    card.querySelectorAll('h1, h2, h3, h4, h5, h6').forEach((header) => {
      header.classList.add('spectrum-Heading', 'spectrum-Heading--sizeM');
    });

    card.querySelectorAll('p').forEach((p) => {
      p.classList.add('spectrum-Body', 'spectrum-Body--sizeM');
    });

    if (isLink === "link") {
      card.querySelectorAll('p > a').forEach((a) => {
        a.classList.add('spectrum-Link', 'spectrum-Button--secondary');
      });
    } else {
      card.querySelectorAll('p > a').forEach((a) => {
        a.classList.remove('spectrum-Button--secondary', 'spectrum-Button--outline');
        a.classList.add('spectrum-Button--accent', 'spectrum-Button--fill', 'spectrum-Button', 'card-button');
      });
    }

    card.querySelectorAll('a').forEach((a) => {
      if (fontColor) {
        a.style.color = fontColor
      }
    });

    if (array.length === 3) {
      card.classList.add('three-card');
    } else if (array.length === 4) {
      card.classList.add('four-card');
    }

    card.querySelectorAll('.three-card > div').forEach((font, index) => {
      if (index === 1) {
        font.style.setProperty('font-size', '16px');
      }
    });
  });
  const observer = new IntersectionObserver((entries) => {
    if (entries.some((e) => e.isIntersecting)) {
      observer.disconnect();
      processImages(block);
    }
  });
  observer.observe(block);
  applyBkgColorOverride(block);
  applyWidthOverride(block);
  applySectionTitle(block);
  applyAnalyticHeaderOverride(block);
}
