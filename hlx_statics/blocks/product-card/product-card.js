import { decorateButtons } from '../../scripts/lib-adobeio.js';

/**
 * decorates the title
 * @param {Element} block The title block element {Parameter Type} Name of the Parameter
 */
export default async function decorate(block) {
    block.setAttribute('daa-lh', 'product-card');
    decorateButtons(block);
    block.querySelectorAll('h1, h2, h3, h4, h5, h6').forEach((h) => {
        h.classList.add('spectrum-Heading', 'spectrum-Heading--sizeS', 'title-heading');
    });
    block.querySelectorAll('p').forEach((p) => {
        p.classList.add('spectrum-Body', 'spectrum-Body--sizeM');
    });
    block.querySelectorAll('a').forEach((a) => {
        if (a.title === "View docs") {
            a.className = "spectrum-Button spectrum-Button--outline spectrum-Button--accent spectrum-Button--sizeM"
        }
    });
    const width = block?.parentElement?.parentElement?.getAttribute('data-width');
    Array.from(block.children).forEach(div => {
        div.style.width = width;
    })

    Array.from(block.children).forEach((div) => {
        const newDiv = document.createElement('div');
        newDiv.classList.add('all-button-container')

        div.lastElementChild.querySelectorAll('.button-container').forEach((p) => {
            newDiv.append(p);
        })

        div.lastElementChild.append(newDiv)
    })

    const parentDiv = document.getElementsByClassName('product-card');
    const childDivs = parentDiv[0].querySelectorAll(':scope > div');
    childDivs.forEach((child) => {
        child.classList.add("spectrum-Card", "spectrum-Card--sizeM")
    });

    const bodyDiv = document.getElementsByClassName('spectrum-Card');
    const childbody = bodyDiv[0].querySelectorAll(':scope > div');
    childbody.forEach((child, index) => {
        if (index === 0) {
            child.classList.add("spectrum-Card-body")
        }
        else if (index === 1) {
            child.classList.add("spectrum-Card-footer");
        }
    });
}