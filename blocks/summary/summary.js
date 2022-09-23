/**
 * decorates the summary
 * @param {Element} block The summary block element
 */
export default function decorate(block) {
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
  // delete image and re-insert as bg
  const summaryImageSrc = block.querySelector('img') ? block.querySelector('img').src.replace('format=png', 'format=webply') : null;
  const summaryImageAlt = block.querySelector('img') ? block.querySelector('img').alt : '';
  const span = document.createElement('span');
  span.role = 'img';
  span.setAttribute('aria-label', summaryImageAlt);
  block.parentElement.parentElement.prepend(span);
  block.querySelectorAll('picture').forEach((picture) => {
    picture.parentElement.parentElement.remove();
  });
  block.parentElement.parentElement.style.backgroundImage = `url(${summaryImageSrc})`;
}
