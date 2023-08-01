import {
    createTag,
    removeEmptyPTags,
  } from '../../scripts/lib-adobeio.js';
  
/**
 * Returns the HTML for a mini resource card
 * @param {*} linkHref The link to the resource
 * @param {*} imgSrc The URL of the resource image
 * @param {*} heading The heading text of the card
 * @param {*} text The text of the card
 * @param {*} altText The alternative text of the card
 * @returns The resource card HTML
 */
function getMiniResourceCard(linkHref, heading, text) {
    if(text === undefined){ //no body just heading
        return `
            <a class="spectrum-Card spectrum-Card--horizontal"
            href=${linkHref}>
            <div class="spectrum-Card-preview mini-resource-card-preview">
                <div class="mini-resource-card-image-container spectrum-Asset">
        
                </div>
            </div>
            <div class="spectrum-Card-body">
                <div class="spectrum-Card-header">
                    <div class="spectrum-Card-title spectrum-Heading spectrum-Heading--sizeXS mini-resource-card-heading">
                        ${heading}
                    </div>
                </div>
            </div>
        </div> `;
    }else{
        return `
                <a class="spectrum-Card spectrum-Card--horizontal"
                href=${linkHref}>
                <div class="spectrum-Card-preview mini-resource-card-preview">
                    <div class="mini-resource-card-image-container spectrum-Asset">
            
                    </div>
                </div>
                <div class="spectrum-Card-body">
                    <div class="spectrum-Card-header">
                        <div class="spectrum-Card-title spectrum-Heading spectrum-Heading--sizeXS mini-resource-card-heading">
                            ${heading}
                        </div>
                    </div>
                    <div class="spectrum-Card-content">
                        <div class="spectrum-Card-description mini-resource-card-body">
                            ${text}
                        </div>
                    </div>
                </div>
            </div> `;
    }
}

/**
 * decorates the mini-resource-card
 * @param {Element} block The mini-resource-card block element
 */
export default async function decorate(block) {
    const grid_div = createTag('div', {class: 'card-container'});
    block.querySelectorAll('.mini-resource-card > div').forEach((resource) => {
        removeEmptyPTags(resource);
        resource.setAttribute('class', 'mini-card');
        grid_div.appendChild(resource);

        //create spectrum cards
        const linkHref = resource.querySelector('a')?.href;
        const heading = resource.querySelector('a')?.innerText;
        const text = resource.querySelector('p')?.innerText;
        const picture = resource.querySelector('picture');
        resource.innerHTML = getMiniResourceCard(linkHref, heading, text);
        const pictureContainer = resource.querySelector('.mini-resource-card-image-container');
        pictureContainer.append(picture);

    });
    block.appendChild(grid_div);

}