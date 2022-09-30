import { decorateButtons } from '../../scripts/lib-adobeio.js';

/**
 * loads and decorates the cards
 * @param {Element} block The cards block element
 */
export default async function decorate(block) {
  decorateButtons(block);
  block.querySelectorAll('.cards > div').forEach((card, index, array) => {
    card.classList.add('spectrum--light');
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
}
