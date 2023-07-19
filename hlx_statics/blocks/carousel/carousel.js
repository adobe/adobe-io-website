import { createTag, decorateButtons, removeEmptyPTags} from '../../scripts/lib-adobeio.js';
/**
 * decorates the carousel
 * @param {Element} block The carousel block element
 */
export default async function decorate(block) {
  removeEmptyPTags(block);
  decorateButtons(block);

  //create a div in block for ease of use
  const carousel_block = document.getElementsByClassName('carousel block')[0];
  const carousel_block_child = createTag('div', {class: 'block-container'});
  carousel_block.append(carousel_block_child);

  //create div with circle progess
  const carousel_block_circle = createTag('div', {id: 'carousel-circles'});
  carousel_block_circle.setAttribute('class', 'carousel-circle-div');
  carousel_block.append(carousel_block_circle);

  //create section tag for animation
  const carousel_section = createTag('section', {class: 'slider-wrapper'});
  carousel_block_child.append(carousel_section);

  //add slide arrow buttons
  const arrow_button_previous = createTag('button', {class: 'slide-arrow'});
  arrow_button_previous.setAttribute('id', 'slide-arrow-previous');
  arrow_button_previous.innerHTML = '&#8249;'
  const arrow_button_forward = createTag('button', {class: 'slide-arrow'});
  arrow_button_forward.setAttribute('id', 'slide-arrow-forward');
  arrow_button_forward.innerHTML = '&#8250;'

  //add ul tag to contain carousel slides
  const carousel_ul = createTag('ul', {class: 'slides-container'});
  carousel_ul.setAttribute('id', 'slides-container');
  carousel_section.append(carousel_ul);

  //add a count to keep track of which slide is showing
  let count = 1;

  block.querySelectorAll('h1, h2, h3, h4, h5, h6').forEach((h) => {
    //create flex display
    h.parentElement.classList.add('carousel-container');

    //add section tag and replace the div with it
    h.parentElement.parentElement.replaceWith(carousel_block_child);
    h.classList.add('spectrum-Heading', 'spectrum-Heading--sizeL', 'carousel-heading');

    //name div for convenience and add divs to section tag
    h.parentElement.setAttribute('id', h.id);

    //add circle for every slide
    let div_slide_circle = document.getElementById('carousel-circles');
    let circle_button = createTag('button', {class: 'carousel-circle'});
    circle_button.setAttribute('id', count);
    div_slide_circle.append(circle_button);
    count += 1;

    //create li tag to hold carousel slide (div)
    let carousel_li = createTag('li', {class: 'slide'});
    carousel_li.setAttribute('id', h.id);
    carousel_ul.append(carousel_li);
    carousel_li.append(h.parentElement);

    //add everything but image to the left div
    let flex_div = createTag('div', { id: 'right-flex-div-'+h.id});
    h.parentElement.append(flex_div);
    flex_div.append(h);

    let button_div = createTag('div', { id: 'button-div-'+h.id});
    h.parentElement.append(button_div);

  });

  //add arrows and slide in proper order
  carousel_block_child.insertBefore(arrow_button_previous, carousel_section);
  carousel_block_child.append(arrow_button_forward);

  //add id to image and add image to left div
  block.querySelectorAll('img').forEach((img) => {
    img.parentElement.parentElement.setAttribute('id', 'IMAGE');

    //add image to left div
    let flex_div = createTag('div', { id: 'left-flex-div-'+img.parentElement.parentElement.parentElement.id});
    img.parentElement.parentElement.parentElement.append(flex_div);
    flex_div.append(img.parentElement.parentElement);
    flex_div.classList.add('left-container');
  });

  block.querySelectorAll('p').forEach(function (p){
    //add everything but image to the right div
    if(p.id === "IMAGE"){
        p.classList.add('spectrum-Body', 'spectrum-Body--sizeS', 'image-container');
    }else{
        let button_div = document.getElementById('button-div-' + p.parentElement.id); 
        if(p.classList.contains('button-container')){
            //add buttons to div
            button_div.classList.add('carousel-button-container');
            button_div.append(p);
        }else{
            let flex_div = document.getElementById('right-flex-div-' + p.parentElement.id); 
            flex_div.setAttribute('class', 'right-container');
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
    //get new slide number
    let slide_selected = document.getElementsByClassName('carousel-circle-selected')[0]
    let slide_selected_num = parseInt(slide_selected.id);
    let new_slide_num = slide_selected_num+1;
    let new_slide;
    if(new_slide_num === count){ //at last slide - can't go forward more
        
    }else{
        new_slide = document.getElementById(new_slide_num);
        //change color of circle
        slide_selected.classList.remove('carousel-circle-selected')
        new_slide.classList.add('carousel-circle-selected');
        //slide over to new slide
        const slideWidth = slide.clientWidth;
        slidesContainer.scrollLeft += slideWidth;
    };  
  });

  prevButton.addEventListener("click", () => {
    //get new slide number
    let slide_selected = document.getElementsByClassName('carousel-circle-selected')[0]
    let slide_selected_num = parseInt(slide_selected.id);
    let new_slide_num = slide_selected_num-1;
    let new_slide;
    if(new_slide_num === 0){ //at first slide - can't go back more

    }else{
        new_slide = document.getElementById(new_slide_num);
        //change color of circle
        slide_selected.classList.remove('carousel-circle-selected');
        new_slide.classList.add('carousel-circle-selected');
        //slide over to new slide
        const slideWidth = slide.clientWidth;
        slidesContainer.scrollLeft -= slideWidth;
    };
  });

  //change color of circle button when clicked
  const buttons = block.querySelectorAll('.carousel-circle');
  buttons[0].classList.add('carousel-circle-selected'); //when reloading first slide should be selected
  
  buttons.forEach((button, i) => {
    button.addEventListener("click", () => {
        let old_slide_num = document.getElementsByClassName('carousel-circle-selected')[0].id;
        let new_slide_num = button.id;
        let difference = new_slide_num - old_slide_num;
        if(difference > 0){ //going forward
            const slideWidth = slide.clientWidth;
            slidesContainer.scrollLeft += (difference * slideWidth);
        }else{ //going back
            const slideWidth = slide.clientWidth;
            slidesContainer.scrollLeft -= (-difference * slideWidth);
        };
        //change circle color
        buttons.forEach((button) =>
            button.classList.remove('carousel-circle-selected')
        );
        button.classList.add('carousel-circle-selected');
    });
  });
}