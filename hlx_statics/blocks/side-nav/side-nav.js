import {
  applyAnalyticHeaderOverride,
  createTag
} from '../../scripts/lib-adobeio.js';
import { fetchSideNavHtml } from '../../scripts/lib-helix.js';

/**
 * Decorates the side-nav
 * @param {Element} block The site-nav block element
 */
export default async function decorate(block) {
  const navigationLinks = createTag('nav', { role: 'navigation' });
  navigationLinks.setAttribute('aria-label', 'Primary');

  const navigationLinksContainer = createTag('div');
  navigationLinks.append(navigationLinksContainer);

  const navigationLinksUl = createTag('ul', { role: 'tree', class: 'spectrum-SideNav spectrum-SideNav--multiLevel' });
  navigationLinksUl.setAttribute('aria-label', 'Table of contents');
  navigationLinksContainer.append(navigationLinksUl);

  const rightIcon = `<svg xmlns="http://www.w3.org/2000/svg" height="18" viewBox="0 0 18 18" width="18">
    <rect id="Canvas" fill="#ff13dc" opacity="0" width="18" height="18" />
    <path class="fill" d="M12,9a.994.994,0,0,1-.2925.7045l-3.9915,3.99a1,1,0,1,1-1.4355-1.386l.0245-.0245L9.5905,9,6.3045,5.715A1,1,0,0,1,7.691,4.28l.0245.0245,3.9915,3.99A.994.994,0,0,1,12,9Z" />
  </svg>`;

  const downIcon = `<svg xmlns="http://www.w3.org/2000/svg" height="18" viewBox="0 0 18 18" width="18">
    <rect id="Canvas" fill="#ff13dc" opacity="0" width="18" height="18" />
    <path class="fill" d="M4,7.01a1,1,0,0,1,1.7055-.7055l3.289,3.286,3.289-3.286a1,1,0,0,1,1.437,1.3865l-.0245.0245L9.7,11.7075a1,1,0,0,1-1.4125,0L4.293,7.716A.9945.9945,0,0,1,4,7.01Z" />
  </svg>`;

  const sideNavHtml = await fetchSideNavHtml();
  if (sideNavHtml) {
    navigationLinksUl.innerHTML = sideNavHtml;
  }

  block.append(navigationLinks);

  block.querySelectorAll('li').forEach((li) => {
    li.classList.add('spectrum-SideNav-item');
  });

  block.querySelectorAll('a').forEach((a) => {
    a.classList.add('spectrum-SideNav-itemLink');
  });

  applyAnalyticHeaderOverride(block);

  function assignLayerNumbers(ul, layer = 1) {
    const listItems = ul.children;

    for (let i = 0; i < listItems.length; i++) {
      const li = listItems[i];
      if (layer === 1) {
        li.classList.add('header');
      }

      const getAnchorTag = li.querySelector('a');
      const childUl = li.querySelector('ul');

      li.setAttribute("role", "treeitem");
      li.setAttribute("aria-level", layer);

      if (getAnchorTag) {
        getAnchorTag.style.paddingLeft = `calc(${layer} * 12px)`;

        getAnchorTag.onclick = (e) => {
          e.preventDefault();
          const isExpanded = li.getAttribute('aria-expanded') === 'true';

          li.setAttribute('aria-expanded', !isExpanded);
          li.classList.toggle('is-expanded', !isExpanded);
          if (childUl) {
            childUl.style.display = isExpanded ? 'none' : 'block';
          }

          updateIcon(getAnchorTag, !isExpanded, Boolean(childUl));

          if (window.location.href === getAnchorTag.href) {
            getAnchorTag.setAttribute("aria-current", "page");
            li.classList.add('is-selected');
            toggleParent(li, true);
          } else {
            window.location.href = getAnchorTag.href;
          }
        };

        if (window.location.href === getAnchorTag.href) {
          li.setAttribute('aria-expanded', true);
          getAnchorTag.setAttribute("aria-current", "page");
          li.classList.add('is-expanded', 'is-selected');
          toggleParent(li, true);
        } else {
          updateState(li, childUl);
        }

        if (childUl) {
          childUl.setAttribute('role', 'group');
          childUl.classList.add('spectrum-SideNav');
          assignLayerNumbers(childUl, layer + 1);
          updateIcon(getAnchorTag, li.classList.contains('is-expanded'), true);
        }
      }
    }
  }

  function toggleParent(li, isExpanded) {
    let parentLi = li.parentElement.closest('li');
    while (parentLi) {
      parentLi.classList.toggle('is-expanded', isExpanded);
      parentLi.setAttribute('aria-expanded', isExpanded);
      const parentUl = parentLi.querySelector('ul');
      if (parentUl) {
        parentUl.style.display = isExpanded ? 'block' : 'none';
      }
      parentLi = parentLi.parentElement.closest('li');
    }
  }

  function updateState(li, childUl) {
    if (childUl && childUl.querySelector('.is-expanded')) {
      li.setAttribute('aria-expanded', true);
      li.classList.add('is-expanded');
      childUl.style.display = 'block';
    } else {
      li.setAttribute('aria-expanded', false);
      li.querySelector('a').removeAttribute("aria-current");
      li.classList.remove('is-expanded', 'is-selected');
      if (childUl) childUl.style.display = 'none';
    }
  }

  function updateIcon(anchorTag, isExpanded, hasChildren) {
    if (hasChildren) {
      const icon = isExpanded ? downIcon : rightIcon;
      const existingIcon = anchorTag.querySelector('svg');

      if (existingIcon) {
        existingIcon.remove();
      }

      anchorTag.innerHTML += icon;
    } else {
      anchorTag.innerHTML = anchorTag.innerHTML.replace(rightIcon, '').replace(downIcon, '');
    }
  }


  assignLayerNumbers(navigationLinksUl);
}
