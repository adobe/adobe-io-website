import { createTag } from '../../scripts/lib-adobeio.js';
import { readBlockConfig } from '../../scripts/lib-helix.js';

export default async function decorate(block) {
  const cfg = readBlockConfig(block);
  block.textContent = '';
  const navPath = cfg.nav || '/nav';
  const resp = await fetch(`${navPath}.plain.html`);
  if (resp.ok) {
    const html = await resp.text();
    block.innerHTML = html;

    const header = block.parentElement;
    header.classList.add('main-header', 'global-nav-header');

    const iconContainer = createTag('p', { class: 'icon-adobe-container' });
    const title = block.querySelector('p:nth-child(1)');
    const siteLink = title.querySelector('strong > a');
    const iconLink = createTag('a', { class: 'na-console-adobeio-link', href: siteLink.href });
    iconLink.innerHTML = '<img class="icon icon-adobe" src="/icons/adobe.svg" alt="adobe icon">';
    iconContainer.appendChild(iconLink);
    siteLink.className = 'nav-console-adobeio-link-text';
    siteLink.innerHTML = `<strong class="spectrum-Heading spectrum-Heading--sizeS icon-adobe-label">${siteLink.innerText}</strong>`;
    iconContainer.appendChild(siteLink);
    header.append(iconContainer);

    const ul = block.querySelector('ul');
    ul.setAttribute('id', 'navigation-links');
    ul.style.listStyleType = 'none';
    const productsLi = ul.querySelector('li:nth-child(1)');
    productsLi.className = 'navigation-products';
    ul.querySelectorAll('a').forEach((a) => {
      if (a.parentElement.tagName === 'STRONG') {
        a.className = 'spectrum-Button spectrum-Button--secondary  spectrum-Button--sizeM';
        const span = createTag('span', { class: 'spectrum-Button-label' });
        span.innerText = a.innerText;
        a.innerText = '';
        a.appendChild(span);
        const li = a.parentElement.parentElement;
        const div = createTag('div', { class: 'nav-view-docs-button' });
        div.appendChild(a);
        ul.removeChild(li);
        ul.appendChild(div);
      }
    });

    header.append(ul);
    block.remove();
  }
}
