import { createTag, removeEmptyPTags, decorateButtons} from '../../scripts/lib-adobeio.js';

/**
 * Returns the HTML for a mini resource card
 * @param {*} linkHref The link to the resource
 * @param {*} heading The heading text of the card
 * @param {*} text The text of the card
 * @returns The resource card HTML
 */
function getMiniResourceCard(linkHref, heading, text) {
    if (text === undefined) { //no body just heading
        return `
            <a class="mini-card" href=${linkHref}>
                <div class="mini-resource-card-image-container ">
        
                </div>
            <div class="mini-resource-card-body">
                <h3 class="spectrum-Heading spectrum-Heading--sizeM ">
                    ${heading}
                </h3>
            </div>`;
    } else {
        return `
            <a class="mini-card" href=${linkHref}>
                <div class="mini-resource-card-image-container ">
        
                </div>
            <div class="mini-resource-card-body">
                <h3 class="spectrum-Heading spectrum-Heading--sizeM">
                    ${heading}
                </h3>
                <p class="spectrum-Body spectrum-Body--sizeS ">
                    ${text}
                </p>
            </div> `;
    }
}

/**
 * decorates the mini-resource-card
 * @param {Element} block The mini-resource-card block element
 */
export default async function decorate(block) {
    let containerParent;
    block.setAttribute('daa-lh', 'mini resource card');
    if (block.classList.contains('primarybutton')) {
        const primaryButton = block.querySelectorAll('a')[0];
        const up = primaryButton.parentElement;
        const container = createTag('p', {class: 'button-container'});
        containerParent = primaryButton.parentElement.parentElement.parentElement;
        containerParent.appendChild(container);
        container.appendChild(up);
        if (!primaryButton.querySelector('img')) {
            if (up.childNodes.length === 1 && up.tagName === 'STRONG'){
                primaryButton.className = 'button primary';
            }
        }
        decorateButtons(containerParent);
    }
    const grid_div = createTag('div', { class: 'card-container' });
    block.querySelectorAll('.mini-resource-card > div').forEach((resource) => {
        if (resource.querySelector(".button-container")) return;
        removeEmptyPTags(resource);
        grid_div.appendChild(resource);

        //create spectrum cards
        const linkHref = resource.querySelector('a')?.href;
        const heading = resource.querySelector('a')?.innerText;
        const text = resource.querySelector('p')?.innerText;
        const picture = resource.querySelector('picture');
        const img = resource.querySelector('img');
        if (img) {
            img.setAttribute('class', 'image-mini');
        }

        resource.innerHTML = getMiniResourceCard(linkHref, heading, text);
        const pictureContainer = resource.querySelector('.mini-resource-card-image-container');
        pictureContainer.append(picture);

    });
    block.appendChild(grid_div);
    if (block.classList.contains('primarybutton')) {
        block.appendChild(containerParent);
    }
}
