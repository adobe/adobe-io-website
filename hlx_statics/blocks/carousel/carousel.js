import { createTag, decorateButtons, removeEmptyPTags} from '../../scripts/lib-adobeio.js';

/**
 * decorates the carousel
 * @param {Element} block The carousel block element
 */
export default async function decorate(block) {
  removeEmptyPTags(block);
  decorateButtons(block);

  block.querySelectorAll('h1, h2, h3, h4, h5, h6').forEach((h) => {
    //create flex display
    h.parentElement.classList.add('carousel-container');
    h.classList.add('spectrum-Heading', 'spectrum-Heading--sizeL', 'carousel-heading');

    h.parentElement.setAttribute('id', h.id);

    //add everything but image to the left div
    let flex_div = createTag('div', { id: 'left-flex-div-'+h.id});
    h.parentElement.append(flex_div);
    flex_div.append(h);

    let button_div = createTag('div', { id: 'button-div-'+h.id});
    h.parentElement.append(button_div);

  });

  block.querySelectorAll('img').forEach((img) => {
    img.classList.add('img-size');
    img.parentElement.parentElement.setAttribute('id', 'IMAGE');

    //add image to right div
    let flex_div = createTag('div', { id: 'right-flex-div-'+img.parentElement.parentElement.parentElement.id});
    img.parentElement.parentElement.parentElement.append(flex_div);
    flex_div.append(img.parentElement.parentElement);
    flex_div.classList.add('right-container');
  });

  block.querySelectorAll('p').forEach(function (p){
    //add everything but image to the left div
    if(p.id === "IMAGE"){
        p.classList.add('spectrum-Body', 'spectrum-Body--sizeS');
    }else{
        let button_div = document.getElementById('button-div-' + p.parentElement.id); 
        if(p.classList.contains('button-container')){
            //add buttons to div
            button_div.classList.add('carousel-button-container');
            button_div.append(p);
        }else{
            let flex_div = document.getElementById('left-flex-div-' + p.parentElement.id); 
            flex_div.setAttribute('class', 'left-container');
            p.classList.add('spectrum-Body', 'spectrum-Body--sizeL');
            flex_div.insertBefore(p, button_div);
        }
    };
  });
}

