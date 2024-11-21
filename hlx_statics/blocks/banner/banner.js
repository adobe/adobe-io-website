/**
 * decorates the banenr
 * @param {Element} block The banner block element
 */
export default async function decorate(block) {
  block.setAttribute('daa-lh', 'banner');
  block.querySelectorAll('h1').forEach((h1) => {
    h1.classList.add('spectrum-Heading', 'spectrum-Heading--sizeXL');
  });
}
