import {
    createTag,
  } from '../../scripts/lib-adobeio.js';

/**
 * decorates the inlinealert
 * @param {Element} block The inlinealert block element
 */
export default async function decorate(block) {
    
    block.querySelectorAll('h1, h2, h3, h4, h5, h6').forEach((h) => {
        h.parentElement.classList.add('spectrum-InLineAlert');
        const p = createTag('div', { class: 'spectrum-InLineAlert-header'});
        p.innerText = h.innerText;
        h.parentElement.replaceChild(p, h);
    });

    block.querySelectorAll('p').forEach((paragraph) => {
        const p = createTag('div', { class: 'spectrum-InLineAlert-content' });
        p.innerText = paragraph.innerText;
        paragraph.parentElement.replaceChild(p, paragraph);
    });
    
  }