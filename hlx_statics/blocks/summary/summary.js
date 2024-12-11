import {
  decorateButtons,
  removeEmptyPTags,
  rearrangeHeroPicture,
} from '../../scripts/lib-adobeio.js';

/**
 * decorates the summary
 * @param {Element} block The summary block element
 */
export default async function decorate(block) {
  block.setAttribute('daa-lh', 'summary');
  decorateButtons(block);
  removeEmptyPTags(block);
  block.classList.add('spectrum--dark');
  if (!block.querySelector('picture')) {
    // when there is no image, the width will be the whole width.
    block.classList.add('no-image');
    // make background to be default to light gray.
    if (!block.classList.contains('background-color-white') && !block.classList.contains('background-color-navy') && !block.classList.contains('background-color-dark-gray')){
      block.classList.add('background-color-gray');
    }

  }

  block.querySelectorAll('h1, h2, h3, h4, h5, h6').forEach((heading) => {
    heading.classList.add('spectrum-Heading', 'spectrum-Heading--sizeL');
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
      // make default to secondary button.  The author can add 'primarybutton' to change the button to filled with blue.
      if (block.classList.contains('primarybutton')) {
        button.classList.add('spectrum-Button', 'spectrum-Button--fill', 'spectrum-Button--accent', 'spectrum-Button--sizeM');
      } else {
        button.classList.add('spectrum-Button', 'spectrum-Button--secondary', 'spectrum-Button--sizeM', 'spectrumButton--overBackground', 'spectrum-Button--outline');
        if (!block.classList.contains('background-color-gray') && !block.classList.contains('background-color-white')) {
          button.classList.add('spectrum-Button--staticWhite');
        }
      }
    });
  });
  const overlayStyle = 'position: absolute; display: flex; left: 0%; z-index: 1000;';
  rearrangeHeroPicture(block, overlayStyle);
}


