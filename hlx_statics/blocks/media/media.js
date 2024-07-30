import { applyBkgColorOverride } from "../../scripts/lib-adobeio.js";

/**
 * decorates the text
 * @param {*} block The text block element
 */

export default async function decorate(block) {
    block.setAttribute('daa-lh', 'media');
    applyBkgColorOverride(block);
    const iframe = document.createElement('iframe');
    const width = block?.parentElement?.parentElement?.getAttribute('data-width');
    const height = block?.parentElement?.parentElement?.getAttribute('data-height');
    iframe.setAttribute('width', `${width}`)
    iframe.setAttribute('height', `${height}`)
    let link = block.firstElementChild.firstElementChild.firstElementChild.href;
    link = link.replace("watch?v=", "embed/")
    link = link.replace("view", "preview")
    iframe.setAttribute('src', `${link}`)
    block.firstElementChild.firstElementChild.appendChild(iframe);
    block.firstElementChild.firstElementChild.firstElementChild.remove()
    block.firstElementChild.firstElementChild.classList.add('iframe-container')
}