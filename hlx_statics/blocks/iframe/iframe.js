import {
    createTag
  } from '../../scripts/lib-adobeio.js';

/**
 * decorates the iframe
 * @param {Element} block The hero block element
 */
export default async function decorate(block) {
    const iframeSrc = block.querySelector('a');

    const iframeContainer = block.parentElement;
    const iframe = createTag('iframe', { class: 'iframe-container', 'src': iframeSrc.href, 'id': 'penpalIframe' });
    iframeContainer.append(iframe);
    block.remove();

}