/**
 * decorates the info
 * @param {Element} block The info block element
 */
export default async function decorate(block) {
  const h1 = block.querySelector('h1');
  h1.classList.add('spectrum-Heading', 'spectrum-Heading--sizeXL');
}
