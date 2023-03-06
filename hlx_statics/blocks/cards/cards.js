import { decorateButtons } from '../../scripts/lib-adobeio.js';
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
  decorateButtons(block);
  block.setAttribute('daa-lh', 'card');
  block.querySelectorAll('.cards > div').forEach((card, index, array) => {

    decorateLightOrDark(block);

    card.querySelectorAll('h1, h2, h3, h4, h5, h6').forEach((header) => {
      header.classList.add('spectrum-Heading', 'spectrum-Heading--sizeM');
    });

    card.querySelectorAll('p').forEach((p) => {
      p.classList.add('spectrum-Body', 'spectrum-Body--sizeM');
    });

    card.querySelectorAll('p > a').forEach((a) => {
      a.classList.remove('spectrum-Button--secondary');
      a.classList.add('spectrum-Button--cta', 'spectrum-Button--fill', 'card-button');
    });

    if (array.length === 3) {
      card.classList.add('three-card');
    } else if (array.length === 4) {
      card.classList.add('four-card');
    }
  });
  const observer = new IntersectionObserver((entries) => {
    if (entries.some((e) => e.isIntersecting)) {
      observer.disconnect();
      processImages(block);
    }
  });
  observer.observe(block);
}
