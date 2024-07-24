import { createTag, removeEmptyPTags } from '../../scripts/lib-adobeio.js';
import {
  createOptimizedPicture,
} from '../../scripts/lib-helix.js';

/**
 * decorates the info-card
 * @param {Element} block The info-card block element
 */
export default async function decorate(block) {
  block.setAttribute('daa-lh', 'info-card');
  removeEmptyPTags(block);

  /* change to ul, li */
  const ul = document.createElement('ul');
  [...block.children].forEach((row) => {
    const li = document.createElement('li');
    const a = document.createElement('a');
    while (row.firstElementChild) a.append(row.firstElementChild);
    [...a.children].forEach((div) => {
      let a_tag, h3_tag, p_tag;
      if (div.children.length === 1 && div.querySelector('picture')) 
        div.className = 'cards-card-image';
      else {// make body class and find link + text
        // find link
        a_tag = div.firstElementChild.firstElementChild.firstElementChild.firstElementChild.firstElementChild;
        a.href = a_tag.href;

        // change text font and size and color
        h3_tag = div.firstElementChild.firstElementChild.firstElementChild.firstElementChild;
        h3_tag.classList.add("spectrum-Heading", "spectrum-Heading--sizeM");
        h3_tag.textContent = a_tag.textContent;
        p_tag = div.children[1];
        p_tag.style.color = 'rgb(110, 110, 110)';
        div.className = 'cards-card-body';
      }
    });
    li.append(a);
    ul.append(li);
  });
  ul.querySelectorAll('img').forEach((img) => img.closest('picture').replaceWith(createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }])));
  block.textContent = '';
  block.append(ul);
}