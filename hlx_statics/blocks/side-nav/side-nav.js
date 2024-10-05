import {
  createTag
} from '../../scripts/lib-adobeio.js';
import {getMetadata } from '../../scripts/lib-helix.js';
/**
 * decorates the side-nav
 * @param {Element} block The site-nav block element
 */
export default async function decorate(block) {
  let pathPrefix;
  let navPath;
  // TODO: make only one call to the config
  if(getMetadata('source') === 'github') {
    pathPrefix = getMetadata('pathprefix').replace('/', '');
    navPath = `${window.location.origin}/${pathPrefix}/config`;
  }
  
  const navigationLinks = createTag('nav', { role: 'navigation'});
  navigationLinks.setAttribute('aria-label', 'Primary');

  const navigationLinksContainer = createTag('div');
  navigationLinks.append(navigationLinksContainer);

  const navigationLinksUl = createTag('ul', {role: 'tree'});
  navigationLinksUl.setAttribute('aria-label', 'Table of contents');
  navigationLinksContainer.append(navigationLinksUl);

  const resp = await fetch(`${navPath}.plain.html`);

  // TODO can be smarter on when to grab the nav 
  if (resp.ok) {
    const html = await resp.text();

    const parser = new DOMParser();
    const htmlDocument = parser.parseFromString(html, "text/html");

    [...htmlDocument.querySelectorAll("p")].forEach((item) => {
      if(item.innerText === 'subPages:') {
        let sideNavItems = item.parentElement.querySelector('ul');
        navigationLinksUl.innerHTML += sideNavItems.innerHTML.replaceAll('<p>', '').replaceAll('</p>','');
      }
    });

  } else {
    // TODO: figure out what to do when side nav not present?
  }

  let sideNavContainer = document.querySelector('.side-nav-container');
  if(sideNavContainer) {
    sideNavContainer.style.gridArea = 'sidenav';
  }
  block.append(navigationLinks);
}