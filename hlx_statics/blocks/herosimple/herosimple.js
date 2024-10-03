import {
    createTag,
    decorateButtons,
    applyAnalyticHeaderOverride,
  } from '../../scripts/lib-adobeio.js';
  import { decorateLightOrDark } from '../../scripts/lib-helix.js';
  
  
  /**
   * decorates the hero
   * @param {Element} block The hero block element
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
    let descriptionPElement = createTag('p', {class:'spectrum-Body spectrum-Body--sizeL'});
    descriptionPElement.innerText = descriptionP;
  
    secondDiv.replaceWith(descriptionPElement);
    // Paragraph decoration
    block.querySelectorAll('p').forEach((p) => {
      if (p.innerText) {
        p.classList.add('spectrum-Body', 'spectrum-Body--sizeL');
      }
    });
  
  
   
  
  
  
    applyAnalyticHeaderOverride(block);
  }