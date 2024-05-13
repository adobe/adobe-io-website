import {
    createTag,
    getBlockSectionContainer
  } from '../../scripts/lib-adobeio.js';

  /**
 * loads and decorates the columns
 * @param {Element} block The columns block element
 */
export default async function decorate(block) {
    const container = getBlockSectionContainer(block);
    block.querySelectorAll('.inlinealert > div > div').forEach((inlineAlert) => {
        inlineAlert.classList.add('spectrum-InLineAlert');
        // replace header with spectrum div
        inlineAlert.querySelectorAll('h1').forEach((header) =>{
            const divHeader = createTag('div', { class: 'spectrum-InLineAlert-header' });
            const parent = header.parentElement;
            divHeader.textContent = header.textContent;
            parent.appendChild(divHeader);
            header.replaceWith(divHeader);
        });

        inlineAlert.querySelectorAll('p').forEach((p) =>{
            const divP = createTag('div', { class: 'spectrum-InLineAlert-content' });
            const parent = p.parentElement;
            divP.textContent = p.textContent;
            parent.appendChild(divP);
            p.replaceWith(divP);
        });
    })

}
  