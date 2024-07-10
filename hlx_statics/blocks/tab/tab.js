import { applyBkgColorOverride } from "../../scripts/lib-adobeio.js";

/**
 * decorates the text
 * @param {*} block The text block element
 */

export default async function decorate(block) {
    block.setAttribute('daa-lh', 'tab');
    applyBkgColorOverride(block);
    const fontcolor = block?.parentElement?.parentElement?.getAttribute('data-fontcolor');
    const orientation = block?.parentElement?.parentElement?.getAttribute('data-orientation');
    block.classList.add(`${orientation}-tab`);
    block.querySelectorAll('p').forEach((p) => {
        p.classList.add('spectrum-Body', 'spectrum-Body--sizeL');
        p.style.color = fontcolor;
    });
    const innerTab = document.createElement('div')
    innerTab.classList.add('innerTab')
    Array.from(block.children).forEach((div, index) => {
        if (index > 0) {
            div.setAttribute('id', `tabView${index - 1}`)
        }
        innerTab.append(div)
    })
    block.append(innerTab)
    block.firstElementChild.firstElementChild.firstElementChild.classList.add('activeTab')
    block.querySelectorAll('#tabView0')[0].classList.add('activeTabContent');
    Array.from(block.firstElementChild.firstElementChild.children).forEach((div, index) => {
        div.setAttribute('aria-controls', `tabView${index}`)
        div.addEventListener("click", () => {
            block.querySelectorAll('.activeTab')[0].classList.remove('activeTab');
            div.classList.add('activeTab');
            block.querySelectorAll('.activeTabContent')[0].classList.remove('activeTabContent');
            block.querySelectorAll(`#${div.getAttribute('aria-controls')}`)[0].classList.add('activeTabContent');
        })
    })
}