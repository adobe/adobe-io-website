import {
  createTag,
  decorateButtons,
  removeEmptyPTags,
  
} from "../../scripts/lib-adobeio.js";
/**
 * decorates the carousel
 * @param {Element} block The carousel block element
 */
export default async function decorate(block) {
  block.setAttribute("daa-lh", "carousel");
  removeEmptyPTags(block);
  decorateButtons(block);
  reformatHyperlinkImages(block);

  const carousel_block_child = createTag("div", { class: "block-container" });
  block.append(carousel_block_child);

  const carousel_block_circle = createTag("div", {
    class: "carousel-circle-div",
  });
  block.append(carousel_block_circle);

  const carousel_section = createTag("section", { class: "slider-wrapper" });
  carousel_block_child.append(carousel_section);

  const arrow_button_previous = createTag("button", { class: "slide-arrow" });
  arrow_button_previous.classList.add("slide-arrow-previous");
  arrow_button_previous.innerHTML = "&#8249;";
  arrow_button_previous.ariaLabel = "backward arrow";
  const arrow_button_forward = createTag("button", { class: "slide-arrow" });
  arrow_button_forward.classList.add("slide-arrow-forward");
  arrow_button_forward.innerHTML = "&#8250;";
  arrow_button_forward.ariaLabel = "forward arrow";
  const carousel_ul = createTag("ul", { class: "slides-container" });
  carousel_section.append(carousel_ul);

  //add a count to keep track of which slide is showing
  let count = 1;

  block.querySelectorAll("h1, h2, h3, h4, h5, h6").forEach((h) => {
    h.parentElement.classList.add("carousel-container");
    h.parentElement.parentElement.replaceWith(carousel_block_child);
    h.classList.add(
      "spectrum-Heading",
      "spectrum-Heading--sizeL",
      "carousel-heading"
    );
    h.parentElement.setAttribute("id", h.id);

    //add circle for every slide
    const div_slide_circle = block.querySelector(".carousel-circle-div");
    const circle_button = createTag("button", { class: "carousel-circle" });
    circle_button.setAttribute("id", count);
    circle_button.ariaLabel = `Slide ${count}`;
    div_slide_circle.append(circle_button);
    count += 1;

    const carousel_li = createTag("li", { class: "slide" });
    carousel_ul.append(carousel_li);
    carousel_li.append(h.parentElement);

    //add everything but image to the left div
    const flex_div = createTag("div", { id: "right-flex-div-" + h.id });
    h.parentElement.append(flex_div);
    flex_div.append(h);

    const button_div = createTag("div", { id: "button-div-" + h.id });
    h.parentElement.append(button_div);
  });

  carousel_block_child.insertBefore(arrow_button_previous, carousel_section);
  carousel_block_child.append(arrow_button_forward);

  //add id to image and add image to left div
  block.querySelectorAll("img").forEach((img) => {
    // checks if dealing with a hyperlinked image
    if (img.parentElement.parentElement.tagName === "A") {
      // if so, adds an extra ".parentElement" becuase image is wrapped in ancor tag
      img.parentElement.parentElement.parentElement.classList.add("IMAGE");
      //add image to left div
      let flex_div = createTag("div", {
        id:
          "left-flex-div-" +
          img.parentElement.parentElement.parentElement.parentElement.id,
      });
      img.parentElement.parentElement.parentElement.parentElement.append(
        flex_div
      );
      flex_div.append(img.parentElement.parentElement.parentElement);
      flex_div.classList.add("left-container");
    } else {
      img.parentElement.parentElement.classList.add("IMAGE");
      //add image to left div
      let flex_div = createTag("div", {
        id: "left-flex-div-" + img.parentElement.parentElement.parentElement.id,
      });
      img.parentElement.parentElement.parentElement.append(flex_div);
      flex_div.append(img.parentElement.parentElement);
      flex_div.classList.add("left-container");
    }
  });

  block.querySelectorAll("p").forEach(function (p) {
    //add everything but image to the right div
    if (p.classList.contains("IMAGE")) {
      p.classList.add("image-container");
    } else {
      let button_div = block.querySelector(
        "[id=button-div-" + p.parentElement.id + "]"
      );
      if (p.classList.contains("button-container")) {
        button_div.classList.add("carousel-button-container");
        button_div.append(p);
      } else {
        let flex_div = block.querySelector(
          "[id=right-flex-div-" + p.parentElement.id + "]"
        );
        flex_div.setAttribute("class", "right-container");
        p.classList.add("spectrum-Body", "spectrum-Body--sizeM");
        flex_div.insertBefore(p, button_div);
      }
    }
  });

  //slide functionality with arrow buttons
  const slidesContainer = block.querySelector(".slides-container");
  const slide = block.querySelector(".slide");
  const prevButton = block.querySelector(".slide-arrow-previous");
  const nextButton = block.querySelector(".slide-arrow-forward");

  //for automatic scrolling
  let isPaused = false;

  nextButton.addEventListener("click", () => {
    isPaused = true;
    const slide_selected = block.querySelector(".carousel-circle-selected");
    const slide_selected_num = parseInt(slide_selected.id);
    const new_slide_num =
      slide_selected_num === count - 1 ? 1 : slide_selected_num + 1;
    const slideDx =
      slidesContainer.clientLeft + slide.clientWidth * (new_slide_num - 1);
    slidesContainer.scrollLeft = slideDx;
    const new_slide = block.querySelector(
      "[id=" + CSS.escape(new_slide_num) + "]"
    );
    slide_selected.classList.remove("carousel-circle-selected");
    new_slide.classList.add("carousel-circle-selected");
  });

  prevButton.addEventListener("click", () => {
    isPaused = true;
    const slide_selected = block.querySelector(".carousel-circle-selected"); //should only be one in the block
    const slide_selected_num = parseInt(slide_selected.id);
    const new_slide_num =
      slide_selected_num === 1 ? count - 1 : slide_selected_num - 1;
    //slide over to new slide
    const slideDx = (new_slide_num - 1) * slide.clientWidth;
    slidesContainer.scrollLeft = slideDx;
    //change color of circle
    const new_slide = block.querySelector(
      "[id=" + CSS.escape(new_slide_num) + "]"
    );
    slide_selected.classList.remove("carousel-circle-selected");
    new_slide.classList.add("carousel-circle-selected");
  });

  // Function to check if mobile screen (matching css width)
  function isMobileScreen() {
    return window.innerWidth <= 700;
  }

  // Swipe detection for mobile screens
  let touchStartX = 0;
  let touchEndX = 0;

  block.addEventListener("touchstart", (e) => {
    if (isMobileScreen()) {
      touchStartX = e.changedTouches[0].screenX; // start point of swipe
    }
  });

  block.addEventListener("touchend", (e) => {
    if (isMobileScreen()) {
      touchEndX = e.changedTouches[0].screenX; // end point of swipe
      handleSwipe();
    }
  });

  // handle swipe gestures
  function handleSwipe() {
    const nextButton = block.querySelector(".slide-arrow-forward");
    const prevButton = block.querySelector(".slide-arrow-previous");

    if (touchEndX < touchStartX) {
      // Swiped left, trigger next slide
      nextButton.click();
    } else if (touchEndX > touchStartX) {
      // Swiped right, trigger previous slide
      prevButton.click();
    }
  }

  /**
   * For images that have hyperlinks attached to them in Google Docs, they are wrapped in an anchor tag, which messes up
   * formatting the carousel slide. This function reformats the images/links so they are in a similar format to other slides
   */
  function reformatHyperlinkImages(block) {
    // Selects all hyper linked images
    block.querySelectorAll("div.embed.block > div > div > a").forEach((a) => {
      const picture = a.firstElementChild.firstElementChild;
      if (picture) {
        a.append(picture);
        a.removeChild(a.firstElementChild);
      }
      const paragraphWrapper = createTag("p", {});
      // Because of link, image is surrounded by numerous divs. Navigates back up to OG parent
      const newDivParent =
        a.parentElement.parentElement.parentElement.parentElement;
      a.parentElement.removeChild(a);
      paragraphWrapper.append(a);
      // pulls out the old image container and replaces it with pargraph-wrapped image
      // Format is same as other slides
      newDivParent.replaceChild(
        paragraphWrapper,
        newDivParent.firstElementChild
      );
    });
  }

  //change color of circle button when clicked
  const buttons = block.querySelectorAll(".carousel-circle");
  buttons[0].classList.add("carousel-circle-selected"); //when reloading first slide should be selected

  buttons.forEach((button, i) => {
    button.addEventListener("click", () => {
      isPaused = true;
      let new_slide_num = button.id;
      const slideDx =
        slidesContainer.clientLeft + slide.clientWidth * (new_slide_num - 1);
      slidesContainer.scrollLeft = slideDx;
      //change circle color
      buttons.forEach((button) =>
        button.classList.remove("carousel-circle-selected")
      );
      button.classList.add("carousel-circle-selected");
    });
  });

  //automatic scrolling
  function advanceSlide() {
    let slide_selected = block.querySelector(".carousel-circle-selected");
    let slide_selected_num = parseInt(slide_selected.id);
    let new_slide_num = slide_selected_num + 1;
    let new_slide;
    if (new_slide_num === count) {
      //at last slide - can't go forward more
      new_slide = block.querySelector("[id=" + CSS.escape(1) + "]");
      //change color of circle
      slide_selected.classList.remove("carousel-circle-selected");
      new_slide.classList.add("carousel-circle-selected");
      //slide over to new slide - needs to start over
      const difference = count - 1 - 1;
      const slideWidth = slide.clientWidth;
      slidesContainer.scrollLeft -= difference * slideWidth;
    } else {
      //slide over to new slide
      const slideDx =
        slidesContainer.clientLeft + slide.clientWidth * slide_selected_num;
      slidesContainer.scrollLeft = slideDx;
      //change color of circle
      new_slide = block.querySelector("[id=" + CSS.escape(new_slide_num) + "]");
      new_slide.classList.add("carousel-circle-selected");
      slide_selected.classList.remove("carousel-circle-selected");
    }
  }

  if (
    block.parentElement.parentElement.classList.contains(
      "background-color-white"
    )
  ) {
    block.parentElement.parentElement.style.backgroundColor = "white";
  }

  const timeout = 9000;
  function slideTimer() {
    if (!isPaused) {
      advanceSlide();
      setTimeout(slideTimer, timeout);
    } else {
      clearTimeout(timer);
      //after set amount of time automatic scrolling can commence
      setTimeout(() => {
        isPaused = false;
      }, 2 * timeout);
      setTimeout(slideTimer, timeout);
    }
  }

  const timer = setTimeout(slideTimer, timeout);
  timer;
  
}
