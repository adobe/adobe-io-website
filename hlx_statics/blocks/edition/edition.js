/**
 * decorates the title
 * @param {Element} block The title block element {Parameter Type} Name of the Parameter
 */
export default async function decorate(block) {
    const backgroundColor = block?.parentElement?.parentElement?.getAttribute('data-Backgroundcolor');
    const fontColor = block?.parentElement?.parentElement?.getAttribute('data-FontColor');
    const fontSize = block?.parentElement?.parentElement?.getAttribute('data-FontSize');

    block.querySelectorAll('.edition > div > div').forEach((div) => {
        Object.assign(div.style, {
            backgroundColor: backgroundColor ? backgroundColor : "rgb(187 2 2)",
            color: fontColor ? fontColor : "white",
            fontSize: fontSize ? fontSize : "12px"
        });
    })

    const contentElement = document.querySelector('.edition > div > div > p:first-of-type');
    const spanElement = document.createElement('span');
    spanElement.innerHTML = contentElement.innerHTML;

    for (let i = 0; i < contentElement.attributes.length; i++) {
        let attr = contentElement.attributes[i];
        spanElement.setAttribute(attr.name, attr.value);
    }

    contentElement.parentNode.replaceChild(spanElement, contentElement);
    const removeChildNode = document.querySelector('.edition > div > div > p');

    if (removeChildNode) {
        const anchorTag = removeChildNode.querySelector('a');
        if (anchorTag) {
            removeChildNode.parentNode.replaceChild(anchorTag, removeChildNode);
            spanElement.appendChild(anchorTag);
        }
    }
}