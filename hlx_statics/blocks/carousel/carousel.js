import { createTag, decorateButtons } from '../../scripts/lib-adobeio.js';


/**
 * decorates the carousel
 * @param {Element} block The carousel block element
 */
export default async function decorate(block) {
  decorateButtons(block);

  block.querySelectorAll('h1, h2, h3, h4, h5, h6').forEach((h) => {
    //add everything but image to a div
    const flex_div = createTag('div', { id: 'flex_div' });
    h.parentElement.append(flex_div);
    flex_div.append(h);

  });

  const flex_div = document.getElementById('flex_div');

  block.querySelectorAll('p').forEach(function (p){
    p.childNodes.forEach(function (child) {
        // console.log(child.nodeName);
        if(child.nodeName === 'PICTURE'){
            
            p.classList.add('spectrum-Body', 'spectrum-Body--sizeL');
        } else {
            console.log(child.nodeName);
            flex_div.appendChild(p);
        };
    });
    
  });

  block.querySelectorAll('h1, h2, h3, h4, h5, h6').forEach((h) => {
    h.classList.add('spectrum-Heading', 'spectrum-Heading--sizeL');
    //make a flex box - row
    h.parentElement.parentElement.classList.add('carousel-format');
  });

  block.querySelectorAll('img').forEach((img) => {
    img.classList.add('img-size');
  });
  


  
}

