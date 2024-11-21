import {
  createTag,
} from '../../scripts/lib-adobeio.js';

/**
 * decorates the herosimple
 * @param {Element} block The herosimple block element
 */
export default async function decorate(block) {

  block.setAttribute('daa-lh', 'hero');
  block.querySelectorAll('h1, h2, h3, h4, h5, h6').forEach((h) => {
    const fontFamily = block?.parentElement?.parentElement?.getAttribute('data-font-family');
    const headerFontSize = block?.parentElement?.parentElement?.getAttribute('data-HeaderFontSize');
    if (fontFamily) {
      h.style.fontFamily = fontFamily;
      h.classList.add('spectrum-Heading', 'spectrum-Heading--sizeXXL');
    } else if (headerFontSize) {
      h.classList.add('spectrum-Heading', 'spectrum-Heading--sizeXXL');
      h.style.fontSize = headerFontSize;
    } else {
      h.classList.add('spectrum-Heading', 'spectrum-Heading--sizeXXL', 'spectrum-Heading');
    }

  });

  // arrange divs
  let firstDiv = block.firstElementChild;
  let secondDiv = block.lastElementChild;

  let wrapperDiv = createTag('div');
  wrapperDiv.appendChild(firstDiv);
  wrapperDiv.appendChild(secondDiv);

  block.appendChild(wrapperDiv);

  // second child inner div make it a p
  let descriptionP = secondDiv.innerText;
  let descriptionPElement = createTag('p', { class: 'spectrum-Body spectrum-Body--sizeL' });
  descriptionPElement.innerText = descriptionP;

  secondDiv.replaceWith(descriptionPElement);
  // Paragraph decoration
  block.querySelectorAll('p').forEach((p) => {
    if (p.innerText) {
      p.classList.add('spectrum-Body', 'spectrum-Body--sizeL');
    }
  });
  const sourceElement = block.querySelector('source[type="image/webp"]');
  const srcsetValue = sourceElement ? sourceElement.getAttribute('srcset') : null;
  const url = srcsetValue.split(' ')[0];
  const imgElement = block.querySelector('img');
  const heroFirstDiv = block.querySelector('.herosimple > div');
  const heroSecondDiv = block.querySelector('.herosimple > div:nth-of-type(2)');
  if (srcsetValue) {
    imgElement.style.display = 'none';
    heroFirstDiv.style.marginBottom = '0px';
    heroSecondDiv.style.marginTop = '0px';
    Object.assign(block.style, {
      backgroundImage: `url(${url})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat'
    });
  }

  const sections = document.querySelectorAll('.section');
  sections.forEach((section) => {
    if (section.classList.contains('herosimple-container')) {
      section.style.margin = '0px';
      section.style.maxWidth = 'none';
      const subParent = document.createElement('div');
      subParent.classList.add('sub-parent');
      const children = Array.from(section.children);
      children.forEach(child => {
        if (!child.classList.contains('herosimple-wrapper')) {
          subParent.appendChild(child);
        }
      });
      const herosimpleWrapper = section.querySelector('.herosimple-wrapper');
      if (herosimpleWrapper) {
        section.insertBefore(subParent, herosimpleWrapper.nextSibling);
      } else {
        section.appendChild(subParent);
      }
      subParent.style.margin = '0 164px';
      subParent.style.maxWidth = '1280px';
    }
  });

}