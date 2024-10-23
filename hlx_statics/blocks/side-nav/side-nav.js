import {
  createTag
} from '../../scripts/lib-adobeio.js';
import {getMetadata } from '../../scripts/lib-helix.js';
import { loadFragment } from '../fragment/fragment.js';

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

  let pathPrefix = getMetadata('pathprefix').replace('/', '');;
  let navPath = `${window.location.origin}/${pathPrefix}/config`;

  const fragment = await loadFragment(navPath);
  let sideNavItems;

  // TODO: normalise paths and also only load in the pages that pertain to the current path 
  [...fragment.querySelectorAll("p")].forEach((item) => {
    if(item.innerText === 'subPages:') {
      sideNavItems = item.parentElement.querySelector('ul');
      // relace annoying p tags
      sideNavItems.querySelectorAll('li').forEach((liItems) => {
        let p = liItems.querySelector('p');
        if(p) {
          p.replaceWith(p.firstChild);
        }
      });
    }
  });

  navigationLinksUl.innerHTML = sideNavItems.innerHTML;

  block.append(navigationLinks);

  block.querySelectorAll('li').forEach((li) =>{
    li.classList.add('spectrum-SideNav-item');
  });

  block.querySelectorAll('a').forEach((a) =>{
    a.classList.add('spectrum-SideNav-itemLink');
  });
}