import { decorateButtons, removeEmptyPTags } from '../../scripts/lib-adobeio.js';

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
 * decorates baz
 * @param {Element} block The baz block element
 */
export default async function decorate(block) {
  decorateButtons(block);
  removeEmptyPTags(block);
  calculateOverlapping(block);
}

