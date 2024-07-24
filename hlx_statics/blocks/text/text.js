import {
  applyBkgColorOverride,
  decorateButtons
} from '../../scripts/lib-adobeio.js';

function rearrangeLinks(block) {
  const contentDiv = block.firstElementChild.querySelectorAll(`div:has(p)`);
  const position = block?.parentElement?.parentElement?.getAttribute('data-position');
  const textLinkContainer = document.createElement('div');
  if (!position) {
    textLinkContainer.classList.add('link-list-container');
  }
  const contentContainer = document.createElement('div');
  contentContainer.classList.add('contentContainer');
  contentDiv.forEach((div) => {
    div.querySelectorAll('p:has(.text-block-link)').forEach((p) => {
      textLinkContainer.append(p);
    });
    div.append(textLinkContainer);
    contentContainer.append(div)
  })
  block.firstElementChild.append(contentContainer);
}
function videoConverter(div) {
  const iFrame = document.createElement('iframe');
  iFrame.setAttribute('src', `${div.firstElementChild.href}`);
  iFrame.classList.add('videoIFrame');
  iFrame.setAttribute('allow', 'autoplay');
  div.append(iFrame);
  div.firstElementChild.remove();
}
function rearrangeButtons(block) {
  const contentDiv = block.firstElementChild.querySelectorAll(`div:has(p)`);
  const textButtonContainer = document.createElement('div');
  textButtonContainer.classList.add('text-button-container');
  const contentContainer = document.createElement('div');
  contentContainer.classList.add('contentContainer');
  contentDiv.forEach((div) => {
    div.querySelectorAll('p.button-container').forEach((p) => {
      textButtonContainer.append(p);
    });
    div.append(textButtonContainer);
    contentContainer.append(div)
  })
  block.firstElementChild.append(contentContainer);
}
/**
 * decorates the text
 * @param {*} block The text block element
 */
export default async function decorate(block) {
  block.setAttribute('daa-lh', 'text');
  const fontcolor = block?.parentElement?.parentElement?.getAttribute('data-fontcolor');
  const position = block?.parentElement?.parentElement?.getAttribute('data-position');
  const margin = block?.parentElement?.parentElement?.getAttribute('data-margin');


  applyBkgColorOverride(block);
  block.querySelectorAll('h1, h2, h3, h4, h5, h6').forEach((h) => {
    h.classList.add('spectrum-Heading', 'spectrum-Heading--sizeL');
    h.style.color = fontcolor;
  });
  block.querySelectorAll('p').forEach((p) => {
    p.classList.add('spectrum-Body', 'spectrum-Body--sizeL');
    p.style.color = fontcolor;
  });
  block.querySelectorAll('p a').forEach((p) => {
    p.classList.add('text-block-link');
  });
  block.querySelectorAll('img').forEach((img) => {
    img.classList.add('textImg');
  });
  block.querySelectorAll('.text > div').forEach((block) => {
    if (position === 'right') {
      block.style.flexDirection = "row-reverse";
    }
    if (position) {
      block.querySelectorAll('a').forEach((a) => {
        if (a.title === "Learn more") {
          a.className = "spectrum-Button spectrum-Button--sizeM spectrum-Button--outline spectrum-Button--secondary";
        }
      });
    }
  });
  block.querySelectorAll('.text > div').forEach((block) => {
    block.style.margin = margin;
  })

  let isImageTextBlock = true
  Array.from(block.firstElementChild.children).forEach((div) => {
    if (div.classList.contains("button-container")) {
      videoConverter(div);
      decorateButtons(block);
      isImageTextBlock = false;
    }
  });
  if (isImageTextBlock) {
    if (!position) {
      rearrangeLinks(block);
    } else {
      block.querySelectorAll('div > div:nth-child(2)').forEach((div) => {
        div.classList.add('textContentContainer');
      });
    }
  }
  else {
    rearrangeButtons(block);
    document.querySelectorAll('.text .contentContainer').forEach((contentContainer) => {
      if (contentContainer.firstElementChild.firstElementChild.tagName.toLowerCase() === 'p') {
        const contentContainerElements = contentContainer.firstElementChild.children;
        const newDiv = document.createElement('div');
        newDiv.classList.add('headIconContainer');
        for (let i = 0; i < contentContainerElements.length; i++) {
          if (contentContainerElements[i].tagName.toLowerCase() === 'p') {
            if (newDiv.children.length > 0) {
              const spliterDiv = document.createElement('div');
              spliterDiv.classList.add('spliterDiv');
              newDiv.append(spliterDiv);
            }
            newDiv.append(contentContainerElements[i]);
            i -= 1;
          } else {
            break;
          }
        }
        contentContainer.firstElementChild.insertBefore(newDiv, contentContainerElements[0]);
      }
    })
  }
}