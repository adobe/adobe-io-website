import {removeEmptyPTags, createTag} from '../../scripts/lib-adobeio.js';

/**
 * Returns the HTML for an accordion item
 * @param {*} heading The heading text of the accordion
 * @returns The accordion item HTML
 */
function getAccordionItem(heading) {
    return `
    <h3>
        <button class="accordion-itemHeader" type="button"> 
            <span class="spectrum-Accordion-ChevronIcon">
                <svg aria-hidden="true" role="img" style="display: block" class="spectrum-Icon spectrum-UIIcon-ChevronRight100">
                    <path d="M4.5 13.25a1.094 1.094 0 01-.773-1.868L8.109 7 3.727 2.618A1.094 1.094 0 015.273 1.07l5.157 5.156a1.094 1.094 0 010 1.546L5.273 12.93a1.091 1.091 0 01-.773.321z" class="spectrum-UIIcon--large"></path>
                    <path d="M3 9.95a.875.875 0 01-.615-1.498L5.88 5 2.385 1.547A.875.875 0 013.615.302L7.74 4.377a.876.876 0 010 1.246L3.615 9.698A.872.872 0 013 9.95z" class="spectrum-UIIcon--medium"></path>                
                </svg>
                <svg aria-hidden="true" role="img" style="display: none" class="spectrum-Icon spectrum-UIIcon-ChevronDown100">
                    <path d="M4.5 13.25a1.094 1.094 0 01-.773-1.868L8.109 7 3.727 2.618A1.094 1.094 0 015.273 1.07l5.157 5.156a1.094 1.094 0 010 1.546L5.273 12.93a1.091 1.091 0 01-.773.321z" class="spectrum-UIIcon--large"></path>
                    <path d="M3 9.95a.875.875 0 01-.615-1.498L5.88 5 2.385 1.547A.875.875 0 013.615.302L7.74 4.377a.876.876 0 010 1.246L3.615 9.698A.872.872 0 013 9.95z" class="spectrum-UIIcon--medium"></path>
                </svg>
            </span>
            ${heading}
        </button>
    </h3>
    <div class="accordion-itemContent" >

    </div>  `;
   //text is added later
}

/**
 * decorates the accordion
 * @param {Element} block The accordion block element
 */
export default async function decorate(block) {
    block.setAttribute('daa-lh', 'accordion');
    removeEmptyPTags(block);
    block.parentElement.parentElement.classList.add('accordion-whole');

    const accordion_div = createTag('div', {class: 'accordion-div'});
    block.querySelectorAll('.accordion > div').forEach((item) => {
        const text = item.querySelector('p');
        if(text === null){ //title
            const title = item.querySelector('h1, h2');
            title.setAttribute('class', 'spectrum-Heading spectrum-Heading--sizeM');
            title.parentElement.setAttribute('class', 'accordion-title');
        }else{ //accordion item
            item.setAttribute("class", "accordion-item");
            const heading = item.querySelector('h3, h4, h5, h6')?.innerText;
            item.innerHTML = getAccordionItem(heading);
            item.querySelector('.accordion-itemContent').appendChild(text);
            accordion_div.appendChild(item);   
        };
    });
    block.appendChild(accordion_div);

  const accordion_items = block.querySelectorAll('.accordion-item');
  accordion_items.forEach((item, i) => {
    item.addEventListener("click", () => {
        const heading = item.querySelector('.accordion-itemHeader');
        const content = item.querySelector('.accordion-itemContent');
        if(!heading.classList.contains('active')){ //click on item - show content
            heading.classList.add('active');
            content.style.display = 'block';
            heading.querySelector('.spectrum-UIIcon-ChevronRight100').style.display = 'none';
            heading.querySelector('.spectrum-UIIcon-ChevronDown100').style.display = 'block';
        }else{ //hide contents
            heading.classList.remove('active');
            content.style.display = 'none';
            heading.querySelector('.spectrum-UIIcon-ChevronRight100').style.display = 'block';
            heading.querySelector('.spectrum-UIIcon-ChevronDown100').style.display = 'none';
        };
    });
  });  
}