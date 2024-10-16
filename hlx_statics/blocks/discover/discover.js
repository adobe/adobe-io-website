import { applyBkgColorOverride, applyWidthOverride, applyAnalyticHeaderOverride } from '../../scripts/lib-adobeio.js';

/**
 * decorates the title
 * @param {Element} block The title block element {Parameter Type} Name of the Parameter
 */
export default async function decorate(block) {
  block.setAttribute('daa-lh', 'discover');
  block.querySelectorAll('h1, h2, h3, h4, h5, h6').forEach((h) => {
    h.classList.add('spectrum-Heading', 'spectrum-Heading--sizeS', 'title-heading');
  });
  block.querySelectorAll('p').forEach((p) => {
    p.classList.add('spectrum-Body', 'spectrum-Body--sizeM');
  });
  block.parentElement.style.display = 'flex';
  block.parentElement.style.justifyContent = 'center';

  applyBkgColorOverride(block);
  applyAnalyticHeaderOverride(block);

  // applyWidthOverride(block); //no longer needed but still need to make the width 1280 in certain sizes

  Array.from(block.children).forEach(div => {
    const containsHeading = div.querySelector('h1, h2, h3, h4, h5, h6') !== null;
    if (containsHeading) {
      var breakDiv = document.createElement('div');
      breakDiv.classList.add('break');

      block.insertBefore(breakDiv, div);
    }
    else {
      div.classList.add('discover-nonheading-child-container')
    }

    div.classList.add('discover-child-container')

    if(div.firstElementChild.firstElementChild.querySelector('img')){
      const newDiv=document.createElement('div');
      
      Array.from(div.firstElementChild.children).forEach((ele,index)=>{
        if(index>0){
          newDiv.append(ele)
        }
      })

      div.firstElementChild.append(newDiv);
      div.firstElementChild.classList.add('discover-child-inner-container')
      div.classList.add('discover-img-child-container')
    }
  })
}