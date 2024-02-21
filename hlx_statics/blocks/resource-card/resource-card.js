import {
  removeEmptyPTags,
  applySectionTitle,
  applyAnalyticHeaderOverride,
} from '../../scripts/lib-adobeio.js';

import {
  createOptimizedPicture,
} from '../../scripts/lib-helix.js';

/**
 * Returns the HTML for a resource card
 * @param {*} linkHref The link to the resource
 * @param {*} imgSrc The URL of the resource image
 * @param {*} heading The heading text of the card
 * @param {*} text The text of the card
 * @param {*} altText The alternative text of the card
 * @returns The resource card HTML
 */
function getResourceCard(linkHref, heading, text) {
  return `
    <a class="spectrum-Card"
      href=${linkHref}
    >
      <div class="spectrum-Card-preview resource-card-preview">
        <div class="resource-card-image-container spectrum-Asset">

        </div>
      </div>
      <div class="spectrum-Card-body resource-card-body">
        <div class="spectrum-Card-header resource-card-header">
          <div class="spectrum-Card-title resource-card-title">
            <h3 class="spectrum-Heading spectrum-Heading--sizeM">
              ${heading}
            </h3>
          </div>
        </div>
        <div class="spectrum-Card-content resource-card-content">
          <div class="spectrum-Card-subtitle">
            <p className="spectrum-Body spectrum-Body-S">
              ${text}
            </p>
          </div>
        </div>
      </div>
    </a>
  `;
}

/**
 * decorates the resource-card
 * @param {Element} block The resource-card block element
 */
export default async function decorate(block) {
  block.setAttribute('daa-lh', 'resource card');
  block.querySelectorAll('.resource-card > div').forEach((resource) => {
    removeEmptyPTags(resource);
    // const resourceCard = createTag('div', { class: 'resource-cards-card' });
    const linkHref = resource.querySelector('a')?.href;
    const heading = resource.querySelector('a')?.innerText;
    const imgSrc = resource.querySelector('img')?.src;
    const text = resource.querySelector('p')?.innerText;
    const altText = resource.querySelector('img')?.alt;
    resource.innerHTML = getResourceCard(linkHref, heading, text);
    const picture = createOptimizedPicture(imgSrc, altText);
    const pictureContainer = resource.querySelector('.resource-card-image-container');
    pictureContainer.append(picture);
  });
  applySectionTitle(block);
  applyAnalyticHeaderOverride(block);
}
