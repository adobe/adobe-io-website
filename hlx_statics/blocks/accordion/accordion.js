import {removeEmptyPTags, createTag} from '../../scripts/lib-adobeio.js';
  
/**
 * Returns the HTML for a mini resource card
 * @param {*} linkHref The link to the resource
 * @param {*} heading The heading text of the card
 * @param {*} text The text of the card
 * @returns The resource card HTML
 */
function getAccordionItem(heading, text) {
    return `
    <h3>
        <button class="accordion-itemHeader" type="button"> 
            <span class="spectrum-Accordion-ChevronIcon">
                <svg aria-hidden="true" role="img" class="spectrum-Icon spectrum-UIIcon-ChevronRight100">
                    <path d="M3 9.95a.875.875 0 01-.615-1.498L5.88 5 2.385 1.547A.875.875 0 013.615.302L7.74 4.377a.876.876 0 010 1.246L3.615 9.698A.872.872 0 013 9.95z" class="spectrum-UIIcon--medium"></path>
                </svg>
            </span>
            ${heading}
        </button>
    </h3>
    <div class="accordion-itemContent" >
        ${text}
    </div>  `;
   
}

/**
 * decorates the accordion
 * @param {Element} block The accordion block element
 */
export default async function decorate(block) {
    block.setAttribute('daa-lh', 'accordion');
    removeEmptyPTags(block);

    const accordion_div = createTag('div', {class: 'accordion-div'});
    block.querySelectorAll('.accordion > div').forEach((item) => {
        item.setAttribute("class", "accordion-item");
        const heading = item.querySelector('h1, h2, h3, h4, h5, h6')?.innerText;
        const text = item.querySelector('p')?.innerText;
        console.log(text);
        item.innerHTML = getAccordionItem(heading, text);
        accordion_div.appendChild(item);
    });
    block.appendChild(accordion_div);


  const accordion_items = block.querySelectorAll('.accordion-item');
  accordion_items.forEach((item, i) => {
    item.addEventListener("click", () => {
        const heading = item.querySelector('.accordion-itemHeader');
        const content = item.querySelector('.accordion-itemContent');
        if(!heading.classList.contains('active')){
            heading.classList.add('active');
            content.style.display = 'block';
        }else{
            heading.classList.remove('active');
            content.style.display = 'none';
        }
        
    });
  });

}