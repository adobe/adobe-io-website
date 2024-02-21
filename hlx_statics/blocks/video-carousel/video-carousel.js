import {
  createTag,
  decorateButtons,
  removeEmptyPTags,
  applyWidthOverride,
  applyBkgColorOverride,
  applyAnalyticHeaderOverride
} from '../../scripts/lib-adobeio.js';

/**
 * decorates the carousel
 * @param {Element} block The carousel block element
 */
export default async function decorate(block) {
  block.setAttribute('daa-lh', 'vidoe-carousel');
  removeEmptyPTags(block);
  decorateButtons(block);

  const video_carousel_block_child = createTag('div', {class: 'video-block-container'});
  block.append(video_carousel_block_child);

  const video_carousel_block_circle = createTag('div', {class: 'video-carousel-circle-div'});
  block.append(video_carousel_block_circle);

  const video_carousel_section = createTag('section', {class: 'video-slider-wrapper'});
  video_carousel_block_child.append(video_carousel_section);

  const video_arrow_button_previous = createTag('button', {class: 'video-slide-arrow'});
  video_arrow_button_previous.classList.add('video-slide-arrow-previous');
  video_arrow_button_previous.innerHTML = '&#8249;'
  const video_arrow_button_forward = createTag('button', {class: 'video-slide-arrow'});
  video_arrow_button_forward.classList.add('video-slide-arrow-forward');
  video_arrow_button_forward.innerHTML = '&#8250;'

  const video_carousel_ul = createTag('ul', {class: 'video-slides-container'});
  video_carousel_section.append(video_carousel_ul);

  //add a count to keep track of which slide is showing
  let count = 1;
  //load the video link.
  const a = block.querySelectorAll('a');
  for (let i=0; i < a.length; i++) {
    loadVideoURL(block, a[i]);
  }

  block.querySelectorAll('h1, h2, h3, h4, h5, h6').forEach((h) => {
    h.parentElement.classList.add('video-container');
    h.parentElement.parentElement.replaceWith(video_carousel_block_child);
    h.classList.add('spectrum-Heading', 'spectrum-Heading--sizeL', 'video-carousel-heading');
    h.parentElement.setAttribute('id', h.id);

    //add circle for every slide
    let div_slide_circle = block.querySelector(".video-carousel-circle-div");
    let circle_button = createTag('button', {class: 'video-carousel-circle'});
    circle_button.setAttribute('id', count);
    div_slide_circle.append(circle_button);
    count += 1;

    let video_carousel_li = createTag('li', {class: 'video-slide'});
    video_carousel_ul.append(video_carousel_li);
    video_carousel_li.append(h.parentElement);

    //add everything but image to the left div
    let flex_div = createTag('div', { id: 'right-flex-div-'+h.id});
    h.parentElement.append(flex_div);
    flex_div.append(h);

    let button_div = createTag('div', { id: 'button-div-'+h.id});
    h.parentElement.append(button_div);

  });

  video_carousel_block_child.insertBefore(video_arrow_button_previous, video_carousel_section);
  video_carousel_block_child.append(video_arrow_button_forward);

  //add id to image and add image to left div
  block.querySelectorAll('.video-element').forEach((vid) => {
    vid.parentElement.parentElement.classList.add('video');
    //add image to left div
    vid.id = 'left-flex-div-'+vid.parentElement.id;
    vid.classList.add('left-container');
  });

  block.querySelectorAll('p').forEach(function (p){
    let button_div = block.querySelector("[id=button-div-" + p.parentElement.id + "]");
    if(p.classList.contains('video-button-container')){
        button_div.classList.add('video-carousel-button-container');
        button_div.append(p);
    }else{
        let flex_div = block.querySelector("[id=right-flex-div-" + p.parentElement.id + "]");
        flex_div.setAttribute('class', 'right-container');
        p.classList.add('spectrum-Body', 'spectrum-Body--sizeM');
        flex_div.insertBefore(p, button_div);
    }
  });

  //slide functionality with arrow buttons
  const videoSlidesContainer = block.querySelector(".video-slides-container");
  const videoSlide = block.querySelector(".video-slide");
  const videoPrevButton = block.querySelector(".video-slide-arrow-previous");
  const videoNextButton = block.querySelector(".video-slide-arrow-forward");

  //for automatic scrolling
  let isPaused = false;

  videoNextButton.addEventListener("click", () => {
    isPaused = true;
    let slide_selected = block.querySelector(".video-carousel-circle-selected");
    let slide_selected_num = parseInt(slide_selected.id);
    let new_slide_num = slide_selected_num+1;
    let new_slide;
    if(new_slide_num !== count){ //at last slide - can't go forward more
      //slide over to new slide
      const slideDx = videoSlidesContainer.clientLeft + (videoSlide.clientWidth * slide_selected_num);
      videoSlidesContainer.scrollLeft = slideDx;
      //change color of circle
      new_slide = block.querySelector("[id=" + CSS.escape(new_slide_num)+ "]");
      slide_selected.classList.remove('video-carousel-circle-selected')
      new_slide.classList.add('video-carousel-circle-selected');
    };
  });

  videoPrevButton.addEventListener("click", () => {
    isPaused = true;
    let slide_selected = block.querySelector(".video-carousel-circle-selected"); //should only be one in the block
    let slide_selected_num = parseInt(slide_selected.id);
    let new_slide_num = slide_selected_num-1;
    let new_slide;
    if(new_slide_num !== 0){ //at first slide - can't go back more
        //slide over to new slide
        const slideDx = (new_slide_num-1) * videoSlide.clientWidth;
        videoSlidesContainer.scrollLeft = slideDx;
        //change color of circle
        new_slide = block.querySelector("[id=" + CSS.escape(new_slide_num)+ "]");
        slide_selected.classList.remove('video-carousel-circle-selected');
        new_slide.classList.add('video-carousel-circle-selected');
    }
  });

  //change color of circle button when clicked
  const buttons = block.querySelectorAll('.video-carousel-circle');
  buttons[0].classList.add('video-carousel-circle-selected'); //when reloading first slide should be selected

  buttons.forEach((button, i) => {
    button.addEventListener("click", () => {
        isPaused = true;
        let new_slide_num = button.id;
        const slideDx = videoSlidesContainer.clientLeft + (videoSlide.clientWidth * (new_slide_num-1));
      videoSlidesContainer.scrollLeft = slideDx;
        //change circle color
        buttons.forEach((button) =>
            button.classList.remove('video-carousel-circle-selected')
        );
        button.classList.add('video-carousel-circle-selected');
    });
  });

  // load the video url and append to the video element.
  function loadVideoURL(block,a) {
    block.className = 'video-carousel';
    const link = a.href;
    const url = new URL(link);
    a.insertAdjacentHTML('afterend', loadUrl(url));
    const videoElement = createTag('div', {class: 'video-element'});
    videoElement.innerHTML = a.parentElement.innerHTML;
    a.parentElement.parentElement.append(videoElement);
    a.parentElement.remove();
    videoElement.querySelector('a').remove();
  };

  function loadUrl (url) {
    let html;
    const embed = url.pathname;
    // Check if the URL is a youtube link.
    const usp = new URLSearchParams(url.search);
    let vid = encodeURIComponent(usp.get('v'));
    const youtubeRegex = /^(https?:\/\/)?(www\.)?(youtube\.com\/(watch\?v=|embed\/)|youtu\.be\/)/;
    if (url.origin.includes('youtu.be')) {
      vid = url.pathname.split('/')[1];
    }
    // allow autoplay to be specified in the section metadata.
    const autoPlay = block?.parentElement?.parentElement?.getAttribute('data-autoplay');

    if (youtubeRegex.test(url)) {
      let dataSource = "https://www.youtube.com";
      dataSource += vid ? "/embed/" + vid + "?rel=0&v=" + vid : embed;
      // if autoplay is true, append autoplay to the datasource.
      dataSource = autoPlay === "true" ? dataSource + "&autoplay=1&mute=1" : dataSource;
      // Render the youtube link through iframe within right container of one of the video carousel slide.
      html = `<div style="left: 0; width: 560px; height: 320px; position: relative; ">
      <img loading="lazy" style="border: 0; top: 0; left: 0; width: 100%; height: 100%; position: absolute;"
        src="https://i.ytimg.com/vi_webp/${vid}/maxresdefault.webp">
          <iframe data-src="${dataSource}" allow="autoplay; encrypted-media; accelerometer; gyroscope; picture-in-picture" allowfullscreen="" scrolling="no" title="Content from Youtube" loading="lazy"></iframe>
      </img>
     </div>`;
    } else {
      // Render the url link through video tag within right container of one of the video carousel slide.
      // if autoplay is true, add autoplay attribute to the video tag.
      html = `<div style="left: 0; width: 100%; height: 0; position: relative; padding-bottom: 56.25%;">
        <video controls loading="lazy" style="border: 0; top: 0; left: 0; width: 100%; height: 100%; position: absolute;" ${autoPlay === 'true' ? `autoplay="true"` : ""} preload="metadata" playsinline muted>
          <source src="${url}" />
        </video>
      </div>`;
    }
    return html;
  };

  //automatic scrolling
  function advanceSlide() {
    let slide_selected = block.querySelector('.video-carousel-circle-selected');
    let slide_selected_num = parseInt(slide_selected.id);
    let new_slide_num = slide_selected_num+1;
    let new_slide;
    if(new_slide_num === count){ //at last slide - can't go forward more
        new_slide = block.querySelector("[id=" + CSS.escape(1)+ "]");
        //change color of circle
        slide_selected.classList.remove('video-carousel-circle-selected')
        new_slide.classList.add('video-carousel-circle-selected');
        //slide over to new slide - needs to start over
        const difference = count - 1 - 1;
        const slideWidth = videoSlide.clientWidth;
        videoSlidesContainer.scrollLeft -= (difference*slideWidth);
    }else{
        //slide over to new slide
        const slideDx = videoSlidesContainer.clientLeft + (videoSlide.clientWidth * slide_selected_num);
        videoSlidesContainer.scrollLeft = slideDx;
        //change color of circle
        new_slide = block.querySelector("[id=" + CSS.escape(new_slide_num)+ "]");
        new_slide.classList.add('video-carousel-circle-selected');
        slide_selected.classList.remove('video-carousel-circle-selected')
    };
  };

  if(block.parentElement.parentElement.classList.contains('background-color-white')){
    block.parentElement.parentElement.style.backgroundColor = 'white';
  };

  function slideTimer() {
    if(!isPaused){
        advanceSlide();
        setTimeout(slideTimer, 9000);
    }else{
        clearTimeout(timer);
        //after set amount of time automatic scrolling can commence
        setTimeout(() => {isPaused = false;}, 18000);
        setTimeout(slideTimer, 9000);
    };
  };

  const timer = setTimeout(slideTimer, 9000);
  timer;
  applyBkgColorOverride(block);
  applyWidthOverride(block);
  applyAnalyticHeaderOverride(block);
}
