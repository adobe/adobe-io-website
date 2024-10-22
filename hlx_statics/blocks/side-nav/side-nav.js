import {
  createTag
} from '../../scripts/lib-adobeio.js';
import {getMetadata } from '../../scripts/lib-helix.js';
/**
 * decorates the side-nav
 * @param {Element} block The site-nav block element
 */
export default async function decorate(block) {
  const navigationLinks = createTag('nav', { role: 'navigation'});
  navigationLinks.setAttribute('aria-label', 'Primary');

  const navigationLinksContainer = createTag('div');
  navigationLinks.append(navigationLinksContainer);

  const navigationLinksUl = createTag('ul', {role: 'tree', class: 'spectrum-SideNav spectrum-SideNav--multiLevel'});
  navigationLinksUl.setAttribute('aria-label', 'Table of contents');
  navigationLinksContainer.append(navigationLinksUl);

  let sideNavContainer = document.querySelector('.side-nav-container');
  if(sideNavContainer) {
    sideNavContainer.style.gridArea = 'sidenav';
  }

  // TODO: have fall back when side nav not available in sessios
  navigationLinksUl.innerHTML = sessionStorage.getItem('sideNav');

  block.append(navigationLinks);

  block.querySelectorAll('li').forEach((li) =>{
    li.classList.add('spectrum-SideNav-item');
  });

  block.querySelectorAll('a').forEach((a) =>{
    a.classList.add('spectrum-SideNav-itemLink');
  });
}