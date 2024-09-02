/**
 * decorates the link
 * @param {Element} block The link block element
 */
export default async function decorate(block) {
    const variant = block?.parentElement?.parentElement?.getAttribute('data-variant');
    const anchorTag = block.querySelector('a');
    block.appendChild(anchorTag);
    const nestedDiv = block.querySelector('div');
    block.removeChild(nestedDiv);
    if (anchorTag) {
        anchorTag.classList.remove('button', 'primary');
        if (variant === 'secondary') {
            anchorTag.classList.add('spectrum-Link', 'spectrum-Link--quiet', 'spectrum-Link--secondary');
        } else {
            anchorTag.classList.add('spectrum-Link', 'spectrum-Link--quiet', 'spectrum-Link--primary');
        }
    }
}