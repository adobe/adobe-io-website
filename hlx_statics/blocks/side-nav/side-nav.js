/**
 * decorates the side-nav
 * @param {Element} block The site-nav block element
 */
export default async function decorate(block) {
  let sideNavContainer = document.querySelector('.side-nav-container');
  if(sideNavContainer) {
    sideNavContainer.style.gridArea = 'sidenav';
  }
}