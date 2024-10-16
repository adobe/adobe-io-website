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
  
  const resp = await fetch(`${navPath}.plain.html`);

  // TODO can be smarter on when to grab the nav 
  if (resp.ok) {
    const html = await resp.text();
    block.innerHTML = html;
  }

  let sideNavContainer = document.querySelector('.side-nav-container');
  if(sideNavContainer) {
    sideNavContainer.style.gridArea = 'sidenav';
  }
}