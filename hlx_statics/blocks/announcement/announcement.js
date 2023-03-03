import { decorateButtons, removeEmptyPTags } from '../../scripts/lib-adobeio.js';

function calculateImagesize(block) { 
  console.log(block);
  var test= block.querySelector('.video-enabled.announcement-container');
  console.log(test);

  var myImg = block.querySelector('.video-enabled.announcement-container picture img');
  console.log(myImg);
  if(myImg !== null){
        console.log(myImg.height);
 

  const divAnnouncement = block.querySelector('.video-enabled.announcement-container picture img');
  console.log(divAnnouncement);
  const firstDivAfterVideo = divAnnouncement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.nextElementSibling;
  console.log(firstDivAfterVideo);
  var secondColumn=firstDivAfterVideo.querySelector('.second-column')[0];
  console.log(secondColumn);
  var overlappingOfImage = myImg.height - 200;
  secondColumn.style.setAttribute("margin-top",overlappingOfImage);
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
  block
  calculateImagesize(block);
}

