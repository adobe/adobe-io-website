import { createTag, decorateButtons, removeEmptyPTags} from '../../scripts/lib-adobeio.js';
/**
 * decorates the carousel
 * @param {Element} block The carousel block element
 */
export default async function decorate(block) {
  removeEmptyPTags(block);
  decorateButtons(block);

  const carousel_block_child = createTag('div', {class: 'block-container'});
  block.append(carousel_block_child);

  //create div with circle progess
  const carousel_block_circle = createTag('div', {class: 'carousel-circle-div'});
//   carousel_block_circle.classList.add('carousel-circle-div');
  block.append(carousel_block_circle);

  //create section tag for animation
  const carousel_section = createTag('section', {class: 'slider-wrapper'});
  carousel_block_child.append(carousel_section);

  //add slide arrow buttons
  const arrow_button_previous = createTag('button', {class: 'slide-arrow'});
  arrow_button_previous.classList.add('slide-arrow-previous');
  arrow_button_previous.innerHTML = '&#8249;'
  const arrow_button_forward = createTag('button', {class: 'slide-arrow'});
  arrow_button_forward.classList.add('slide-arrow-forward');
  arrow_button_forward.innerHTML = '&#8250;'

  //add ul tag to contain carousel slides
  const carousel_ul = createTag('ul', {class: 'slides-container'});
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
    let div_slide_circle = block.querySelector(".carousel-circle-div");
    let circle_button = createTag('button', {class: 'carousel-circle'});
    circle_button.setAttribute('id', count);
    div_slide_circle.append(circle_button);
    count += 1;

    //create li tag to hold carousel slide (div)
    let carousel_li = createTag('li', {class: 'slide'});
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
    img.parentElement.parentElement.classList.add('IMAGE');

    //add image to left div
    let flex_div = createTag('div', { id: 'left-flex-div-'+img.parentElement.parentElement.parentElement.id});
    img.parentElement.parentElement.parentElement.append(flex_div);
    flex_div.append(img.parentElement.parentElement);
    flex_div.classList.add('left-container');
  });

  block.querySelectorAll('p').forEach(function (p){
    //add everything but image to the right div
    if(p.classList.contains("IMAGE") ){
        p.classList.add('spectrum-Body', 'spectrum-Body--sizeS', 'image-container');
    }else{
        let button_div = block.querySelector("[id=button-div-" + CSS.escape(p.parentElement.id)+ "]");
        if(p.classList.contains('button-container')){
            //add buttons to div
            button_div.classList.add('carousel-button-container');
            button_div.append(p);
        }else{
            let flex_div = block.querySelector("[id=right-flex-div-" + CSS.escape(p.parentElement.id)+ "]");
            flex_div.setAttribute('class', 'right-container');
            p.classList.add('spectrum-Body', 'spectrum-Body--sizeM');
            flex_div.insertBefore(p, button_div);
        }
    };
  });

  //slide functionality with arrow buttons
  const slidesContainer = block.querySelector(".slides-container");
  const slide = block.querySelector(".slide");
  const prevButton = block.querySelector(".slide-arrow-previous");
  const nextButton = block.querySelector(".slide-arrow-forward");

  let isPaused = false;
  
  nextButton.addEventListener("click", () => {
    isPaused = true;
    //get new slide number
    let slide_selected = block.querySelector(".carousel-circle-selected");
    let slide_selected_num = parseInt(slide_selected.id);
    let new_slide_num = slide_selected_num+1;
    let new_slide;
    if(new_slide_num === count){ //at last slide - can't go forward more
        
    } else {
        //slide over to new slide
        const slideDx = slidesContainer.scrollLeft + (slide.clientWidth * slide_selected_num);
        slidesContainer.scrollLeft = slideDx;
        new_slide = block.querySelector("[id=" + CSS.escape(new_slide_num)+ "]");
        //change color of circle
        slide_selected.classList.remove('carousel-circle-selected')
        new_slide.classList.add('carousel-circle-selected');
    };  
  });

  prevButton.addEventListener("click", () => {
    isPaused = true;
    //get new slide number
    let slide_selected = block.querySelector(".carousel-circle-selected"); //should only be one in the block
    let slide_selected_num = parseInt(slide_selected.id);
    let new_slide_num = slide_selected_num-1;
    let new_slide;
    if(new_slide_num === 0){ //at first slide - can't go back more

    }else{
      //slide over to new slide
      const slideDx = slidesContainer.scrollLeft - (slide.clientWidth * slide_selected_num);
      slidesContainer.scrollLeft = slideDx;

      new_slide = block.querySelector("[id=" + CSS.escape(new_slide_num)+ "]");
      //change color of circle
      slide_selected.classList.remove('carousel-circle-selected');
      new_slide.classList.add('carousel-circle-selected');

    };
  });

  //change color of circle button when clicked
  const buttons = block.querySelectorAll('.carousel-circle');
  buttons[0].classList.add('carousel-circle-selected'); //when reloading first slide should be selected
  
  buttons.forEach((button, i) => {
    button.addEventListener("click", () => {
        isPaused = true;
        let old_slide_num = block.querySelector(".carousel-circle-selected").id; //should only be one in the block
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

  //automatic scrolling
  function advanceSlide() {
    //get new slide number
    let slide_selected = block.querySelector('.carousel-circle-selected'); //should only be one in the block
    let slide_selected_num = parseInt(slide_selected.id);
    let new_slide_num = slide_selected_num+1;
    let new_slide;
    if(new_slide_num === count){ //at last slide - can't go forward more
        new_slide = block.querySelector("[id=" + CSS.escape(1)+ "]");
        //change color of circle
        slide_selected.classList.remove('carousel-circle-selected')
        new_slide.classList.add('carousel-circle-selected');
        //slide over to new slide - needs to start over
        const difference = count - 1 - 1;
        const slideWidth = slide.clientWidth;
        slidesContainer.scrollLeft -= (difference*slideWidth);
    }else{
        //slide over to new slide
        const slideWidth = slide.clientWidth;
        slidesContainer.scrollLeft += slideWidth;
        new_slide = block.querySelector("[id=" + CSS.escape(new_slide_num)+ "]");
        //change color of circle
        new_slide.classList.add('carousel-circle-selected');
        slide_selected.classList.remove('carousel-circle-selected')
        
    };  
  };
  
  function slideTimer() {
    if(!isPaused){
        // console.log("not paused");
        advanceSlide();
        setTimeout(slideTimer, 9000);
    }else{
        // console.log("paused");
        clearTimeout(timer);
        //after set amount of time automatic scrolling can commence
        setTimeout(() => {isPaused = false;}, 18000);
        setTimeout(slideTimer, 9000);
    };   
  };

//   const timer = setTimeout(slideTimer, 9000);
//   timer;

}

  

