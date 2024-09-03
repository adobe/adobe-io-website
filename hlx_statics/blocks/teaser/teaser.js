
import { decorateActionButton } from '../../components/actionButton.js';
import { decorateButtons, removeEmptyPTags, applyBkgColorOverride } from '../../scripts/lib-adobeio.js';

/** 
 * @param {Element} block
 */
function rearrangeLinks(block, isActionButton) {
  const leftDiv = block.firstElementChild.firstElementChild;
  const teaserblockButton = document.createElement('div');
  teaserblockButton.classList.add('teaser-button-container');

  const buttons = leftDiv.querySelectorAll('p.button-container');
  buttons.forEach((p) => {
    if (isActionButton)
      decorateActionButton({ actionButton: p, size: 'M' })
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
  const button = parent?.getAttribute('data-Button');
  const isActionButton = parent?.getAttribute('data-isactionbutton');

  block.setAttribute('daa-lh', 'teaser');
  block.querySelectorAll('h1, h2, h3, h4, h5, h6').forEach((h) => {
    h.classList.add('spectrum-Heading', 'spectrum-Heading--sizeL', 'teaser-heading');
    h.style.color = fontcolor;
    h.style.wordBreak = "break-all";
    h.style.whiteSpace = "normal";
  });
  block.querySelectorAll('p').forEach((p) => {
    p.classList.add('spectrum-Body', 'spectrum-Body--sizeL');
    p.style.color = fontcolor;
    p.style.wordBreak = "break-all";
    p.style.whiteSpace = "normal";
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
      innerElement.style.width = "750px"
    }
  }
  if (button === "PrimaryButton") {
    block.querySelectorAll('a').forEach((a) => {
      a.className = "spectrum-Button spectrum-Button--fill spectrum-Button--accent spectrum-Button--sizeM";
    });
  }

  if (!isActionButton) {
    decorateButtons(block, secondaryButtonBorderColor, secondaryButtonColor);
  }
  removeEmptyPTags(block);
  rearrangeLinks(block, isActionButton);
  setBackgroundImage(block);
  applyBkgColorOverride(block);
}
