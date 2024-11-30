import { decorateActionButton } from '../../components/actionButton.js';
import { decorateButtons, removeEmptyPTags } from '../../scripts/lib-adobeio.js';

/**
 * @param {Element} block
 */
function rearrangeLinks(block, isActionButton) {
  const leftDiv = block.firstElementChild.firstElementChild;
  const announcementblockButton = document.createElement('div');
  announcementblockButton.classList.add('announcement-button-container');

  const buttons = leftDiv.querySelectorAll('p.button-container');
  buttons.forEach((p) => {
    if (isActionButton)
      decorateActionButton({ actionButton: p, size: 'M' })
    announcementblockButton.append(p);
  });
  leftDiv.append(announcementblockButton);
}

/**
 * @param {Element} block
 */
function setBackgroundImage(block) {
  const img = block.querySelector('picture img');

  if (img) {
    const announcementContainer = block.closest('.announcement-container');
    const imgParent = img.closest('picture').parentElement;
    Object.assign(announcementContainer.style, {
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
  let position = parent?.getAttribute('data-position') || "center";
  const button = parent?.getAttribute('data-Button');
  const isActionButton = parent?.getAttribute('data-isactionbutton');

  block.setAttribute('daa-lh', 'announcement');
  block.querySelectorAll('h1, h2, h3, h4, h5, h6').forEach((h) => {
    h.classList.add('spectrum-Heading', 'spectrum-Heading--sizeL', 'announcement-heading');
    h.style.wordBreak = "break-all";
    h.style.whiteSpace = "normal";
  });
  block.querySelectorAll('p').forEach((p) => {
    p.classList.add('spectrum-Body', 'spectrum-Body--sizeL');
    p.style.wordBreak = "break-all";
    p.style.whiteSpace = "normal";
  });

  if (button === "PrimaryButton") {
    block.querySelectorAll('a').forEach((a) => {
      a.className = "spectrum-Button spectrum-Button--fill spectrum-Button--accent spectrum-Button--sizeM";
    });
  }

  if (!isActionButton) {
    decorateButtons(block);
  }
  removeEmptyPTags(block);
  rearrangeLinks(block, isActionButton);
  setBackgroundImage(block);
}
