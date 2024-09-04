import decorateLink from '../../components/link.js';
/**
 * decorates the link
 * @param {Element} block The link block element
*/
export default async function decorate(block) {
    const variant = block?.parentElement?.parentElement?.getAttribute('data-variant');
    const link = block.querySelector('a');
    block.appendChild(link);
    const nestedDiv = block.querySelector('div');
    block.removeChild(nestedDiv);
    link.classList.remove('button', 'primary');
    decorateLink({link,variant:variant});
}