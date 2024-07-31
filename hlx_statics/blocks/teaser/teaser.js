import { decorateButtons, removeEmptyPTags } from '../../scripts/lib-adobeio.js';

/** 
 * @param {Element} block
 */
function rearrangeLinks(block) {
  const leftDiv = block.firstElementChild.firstElementChild;
  const teaserblockButton = document.createElement('div');
  teaserblockButton.classList.add('teaser-button-container');

  const buttons = leftDiv.querySelectorAll('p.button-container');
  buttons.forEach((p) => {
    teaserblockButton.append(p);
  });
  leftDiv.append(teaserblockButton);
}

/** 
 * @param {Element} block
 */
function setBackgroundImage(block) {
  const img = block.querySelector('picture img');

  if (img) {
    const teaserContainer = block.closest('.teaser-container');
    const imgParent = img.closest('picture').parentElement;
    Object.assign(teaserContainer.style, {
      backgroundImage: `url('${img.src}')`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      padding: '4% 0%'
    });
    imgParent.style.display = 'none';
  }
}

/**
 * @param {Element} block
 */
export default async function decorate(block) {
  const parent = block?.parentElement?.parentElement;
  const fontcolor = parent?.getAttribute('data-fontcolor') || "white";
  const secondaryButtonBorderColor = parent?.getAttribute('data-secondarybuttonbordercolor');
  const secondaryButtonColor = parent?.getAttribute('data-secondarybuttoncolor');
  let position = parent?.getAttribute('data-position') || "center";

  block.setAttribute('daa-lh', 'teaser');
  block.querySelectorAll('h1, h2, h3, h4, h5, h6').forEach((h) => {
    h.classList.add('spectrum-Heading', 'spectrum-Heading--sizeL', 'teaser-heading');
    h.style.color = fontcolor;
  });
  block.querySelectorAll('p').forEach((p) => {
    p.classList.add('spectrum-Body', 'spectrum-Body--sizeL');
    p.style.color = fontcolor;
    if(alignitems){
      p.style.color = '#e2caf1';
    }
  });
  block.querySelectorAll('a').forEach((a) => {
    if (a.title === "Learn more" || "Explore more") {
      a.className = "spectrum-Button spectrum-Button--fill spectrum-Button--accent spectrum-Button--sizeM"

      block.querySelectorAll('.teaser > div').forEach((div) => {
        div.style.justifyContent = 'center';
        div.style.marginLeft = '0px';
      })
      block.querySelectorAll('.teaser > div > div').forEach((div) => {
        div.style.width = 'auto';
        if (alignitems) {
          div.style.alignItems = alignitems;
          div.style.gap = '20px';
        }
      })
    }
    if (a.title === "Try an add-on") {
      a.className = "spectrum-Button spectrum-Button--sizeM spectrum-Button--outline spectrum-Button--secondary"
      block.querySelectorAll('a > .spectrum-Button-label').forEach((div) => {
        if (div.textContent === 'Try an add-on') {
          div.style.color = 'white'
        }
      })
    }
  });

  if (position) {
    const teaserElement = block.querySelector('div');
    const innerElement = teaserElement.querySelector('div');

    Object.assign(teaserElement.style, {
      justifyContent: position,
      margin: position === "center" ? 0 : ''
    });

    if (innerElement && position === "center") {
      innerElement.style.alignItems = position;
    }
    
    if (innerElement && position === "end") {
      Object.assign(teaserElement.style, {
        marginRight: "5%"
      });
    }
  }

  decorateButtons(block, secondaryButtonBorderColor, secondaryButtonColor);
  removeEmptyPTags(block);
  rearrangeLinks(block);
  setBackgroundImage(block);
}