// import { applyBkgColorOverride } from "../../scripts/lib-adobeio";

/**
 * decorates the title
 * @param {*} block The title block element
 */
export default async function decorate(block) {
  block.setAttribute('daa-lh', 'title');

  block.querySelectorAll('h1, h2, h3, h4, h5, h6').forEach((h) => {
    h.classList.add('spectrum-Heading', 'spectrum-Heading--sizeL', 'title-heading');
  });

  block.querySelectorAll('p').forEach((p) => {
    p.classList.add('spectrum-Body', 'spectrum-Body--sizeL');
  });

  // applyBkgColorOverride(block);

}
