import { createTag, decorateButtons, removeEmptyPTags} from '../../scripts/lib-adobeio.js';

/**
 * decorates the carousel
 * @param {Element} block The carousel block element
 */
export default async function decorate(block) {
  removeEmptyPTags(block);
  decorateButtons(block);

  //create section tag for animation
  const carousel_block = document.getElementsByClassName('carousel block')[0];
  const carousel_section = createTag('section', {class: 'slider-wrapper'});
  carousel_block.append(carousel_section);

  //add slide arrow buttons
  const arrow_button_previous = createTag('button', {class: 'slide-arrow'});
  arrow_button_previous.setAttribute('id', 'slide-arrow-previous');
  arrow_button_previous.innerHTML = '&#8249;'
  const arrow_button_forward = createTag('button', {class: 'slide-arrow'});
  arrow_button_forward.setAttribute('id', 'slide-arrow-forward');
  arrow_button_forward.innerHTML = '&#8250;'
  carousel_block.append(arrow_button_previous);
  carousel_block.append(arrow_button_forward);

  //add ul tag to contain carousel slides
  const carousel_ul = createTag('ul', {class: 'slides-container'});
  carousel_ul.setAttribute('id', 'slides-container');
  carousel_section.append(carousel_ul);

  block.querySelectorAll('h1, h2, h3, h4, h5, h6').forEach((h) => {
    //create flex display
    h.parentElement.classList.add('carousel-container');
    //add section tag for animation
    h.parentElement.parentElement.replaceWith(carousel_section);
    h.classList.add('spectrum-Heading', 'spectrum-Heading--sizeL', 'carousel-heading');

    //name div for convenience and add divs to section tag
    h.parentElement.setAttribute('id', h.id);

    //create li tag to hold carousel slide (div)
    let carousel_li = createTag('li', {class: 'slide'});
    carousel_li.setAttribute('id', h.id);
    carousel_ul.append(carousel_li);
    carousel_li.append(h.parentElement);

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

  //slide functionality with arrow buttons
  const slidesContainer = document.getElementById("slides-container");
  const slide = document.querySelector(".slide");
  const prevButton = document.getElementById("slide-arrow-previous");
  const nextButton = document.getElementById("slide-arrow-forward");

  nextButton.addEventListener("click", () => {
    const slideWidth = slide.clientWidth;
      slidesContainer.scrollLeft += slideWidth;
  });

  prevButton.addEventListener("click", () => {
    const slideWidth = slide.clientWidth;
    slidesContainer.scrollLeft -= slideWidth;
  });
  

}

