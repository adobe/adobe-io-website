/**
 * decorates the title
 * @param {Element} block The title block element {Parameter Type} Name of the Parameter
 */
export default async function decorate(block) {
    block.querySelectorAll('.edition > div > div').forEach((div) => {
        Object.assign(div.style, {
            backgroundColor: "rgb(187 2 2)",
            color: "white",
            fontSize: "12px"
        });
    })
}