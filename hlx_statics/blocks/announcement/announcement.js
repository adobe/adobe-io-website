import { decorateButtons, removeEmptyPTags, applyWidthOverride, applyBkgColorOverride, applyAnalyticHeaderOverride } from '../../scripts/lib-adobeio.js';

function calculateOverlapping(block) {
  var myImg = block.querySelector('picture img');
  if (myImg !== null) {
    let marginToAdd = myImg.height - 200;
    const firstDivAfterVideo = block.parentElement.parentElement.nextElementSibling;

    const ro = new ResizeObserver(entries => {
      for (let entry of entries) {
        var actualWidth = window.innerWidth;
        if (actualWidth < 1280)
          marginToAdd = 0;
        else
          marginToAdd = myImg.height - 200;
        entry.target.style.margin = marginToAdd + "px 0 0";
      }
    });
    ro.observe(firstDivAfterVideo);

    var actualWidth = window.innerWidth;
    if (actualWidth < 1280)
      marginToAdd = 0;
    firstDivAfterVideo.style.margin = marginToAdd + "px 0 0"
  }
}

/**
 * decorates the announcement
 * @param {Element} block The announcement block element
 */
export default async function decorate(block) {
  decorateButtons(block);
  removeEmptyPTags(block);
  block.setAttribute('daa-lh', 'announcement');
  block.querySelectorAll('h1, h2, h3, h4, h5, h6').forEach((h) => {
    h.classList.add('spectrum-Heading', 'spectrum-Heading--sizeL', 'announce-heading');
  });
  block.querySelectorAll('p').forEach((p) => {
    p.classList.add('spectrum-Body', 'spectrum-Body--sizeL');
  });
  block.querySelectorAll('p').forEach((paragraph) => {
    paragraph.classList.add('spectrum-Body');
    paragraph.classList.add('spectrum-Body--sizeL');
  });
  block.querySelectorAll('p a').forEach((link) => {
    link.parentElement.classList.add('announce-link');
  });
  applyBkgColorOverride(block);
  applyWidthOverride(block);
  calculateOverlapping(block);
  applyAnalyticHeaderOverride(block);
}

