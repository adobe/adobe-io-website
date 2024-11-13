import {
  decorateButtons,
} from '../../scripts/lib-adobeio.js';
import { decorateLightOrDark } from '../../scripts/lib-helix.js';

/**
 * Rearranges the links into a hero-button-container div
 * @param {*} block The hero block element
 */
function rearrangeLinks(block) {
  const leftDiv = block.firstElementChild.firstElementChild;
  const heroButtonContainer = document.createElement('div');
  heroButtonContainer.classList.add('hero-button-container');
  leftDiv.querySelectorAll('p.button-container').forEach((p) => {
    heroButtonContainer.append(p);
  });
  leftDiv.append(heroButtonContainer);
}

/**
 * decorates the hero
 * @param {Element} block The hero block element
 */
export default async function decorate(block) {
  block.setAttribute('daa-lh', 'hero');
  // Block decoration
  decorateLightOrDark(block, true);
  // H1 decoration
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
      h.classList.add('spectrum-Heading', 'spectrum-Heading--sizeXXL', 'spectrum-Heading--serif');
    }
  });

  block.querySelectorAll('picture source').forEach((picture) => {
    // Removes weird max-width attribute
    picture.media = '';
  });

  // Removes content for span.icon
  block.querySelectorAll('span.icon').forEach((span) => {
    span.textContent = '';
  });
  // Link decoration
  rearrangeLinks(block);
  decorateButtons(block);
  // Paragraph decoration
  block.querySelectorAll('p').forEach((p) => {
    if (p.innerText) {
      p.classList.add('spectrum-Body', 'spectrum-Body--sizeL');
    }
  });

  const backgroundImage = block?.parentElement?.parentElement?.getAttribute('data-BackgroundImage');
  const fontColor = block?.parentElement?.parentElement?.getAttribute('data-fontColor');
  // const blockImageWidth = block?.parentElement?.parentElement?.getAttribute('data-BlockImageWidth');
  const blockImage = block?.parentElement?.parentElement?.getAttribute('data-BlockImage');
  const heroWrapper = block?.parentElement?.parentElement;

  if (backgroundImage) {
    heroWrapper.querySelectorAll('.hero-container > div').forEach((herowrapper) => {
      Object.assign(herowrapper.style, {
        backgroundImage: `url(${backgroundImage})`,
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'cover',
      });
    });
    heroWrapper.querySelectorAll('.hero-container > div > div').forEach((herowrapper) => {
      Object.assign(herowrapper.style, {
        backgroundColor: 'transparent',
        width: '75%',
        margin: 'auto',
      });
    });
  }
  if (fontColor) {
    block.querySelectorAll('h1, p, a, span').forEach((font) => {
      font.style.setProperty('color', fontColor, 'important');
    });
  }
  // block.querySelectorAll('img').forEach((img) => {
  //   if (blockImageWidth) {
  //     Object.assign(img.style, {
  //       width: blockImageWidth,
  //       objectFit: 'contain',
  //     });
  //   } else {
  //     Object.assign(img.style, {
  //       width: '600px',
  //       height: '400px',
  //       objectFit: 'contain',
  //     });
  //   }
  // });

  if (blockImage?.toLocaleLowerCase() === 'visible') {
    heroWrapper.querySelectorAll('picture').forEach((picture) => {
      picture.style.setProperty('display', 'block', 'important');
    });
    heroWrapper.querySelectorAll('main div.hero div:nth-child(2)').forEach((picture) => {
      picture.style.setProperty('display', 'block', 'important');
    });
  }
}
