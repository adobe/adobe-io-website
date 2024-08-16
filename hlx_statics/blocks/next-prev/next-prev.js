/**
 * decorates the next-prev
 * @param {Element} block The next-prev block element
 * 
 */
export default async function decorate(block) {

  function extractMenuData(element) {
    const data = [];

    element.querySelectorAll('li').forEach(li => {
      const link = li.querySelector('a');
      const href = link ? link.getAttribute('href') : '';
      const title = link ? link.getAttribute('title') : '';

      data.push({
        title: title,
        href: href
      });
    });

    return data;
  }

  const sideNavContainer = document.querySelector('.side-nav-container');
  const menuData = extractMenuData(sideNavContainer.querySelector('ul'));

  const currentPath = window?.location?.pathname;
  function getPathFromHref(href) {
    return href.split('http://')[1] || '';
  }

  const currentPathData = menuData.find(menu => `/${getPathFromHref(menu.href)}` === currentPath);
  const currentIndex = menuData.findIndex(menu => menu.href === currentPathData?.href);

  const previousPage = currentIndex > 0 ? menuData[currentIndex - 1] : null;
  const nextPage = currentIndex < menuData.length - 1 ? menuData[currentIndex + 1] : null;

  const Prev = block.querySelector('.next-prev>div>div');
  Prev.classList.add("spectrum-Body", "spectrum-Body--sizeM");
  block.appendChild(Prev);

  const Prev_one = document.createElement('div');
  Prev_one.classList.add('main-one-innerDiv');
  Prev.appendChild(Prev_one);

  const createIconSvg = (direction) => {
    const path = direction === 'left'
      ? 'M12 18a1.988 1.988 0 0 0 .585 1.409l7.983 7.98a2 2 0 1 0 2.871-2.772l-.049-.049L16.819 18l6.572-6.57a2 2 0 0 0-2.773-2.87l-.049.049-7.983 7.98A1.988 1.988 0 0 0 12 18z'
      : 'M24 18a1.988 1.988 0 0 1-.585 1.409l-7.983 7.98a2 2 0 1 1-2.871-2.772l.049-.049L19.181 18l-6.572-6.57a2 2 0 0 1 2.773-2.87l.049.049 7.983 7.98A1.988 1.988 0 0 1 24 18z';
    return `<svg viewBox="0 0 36 36" focusable="false" aria-hidden="true" role="img" class="spectrum-Icon spectrum-Icon--sizeM"><path d="${path}"></path></svg>`;
  }

  const createLink = (href, title, direction, classname) => {
    const container = document.createElement('div');
    container.classList.add(direction === 'left' ? 'anchor-inside-div' : 'anchor_inside_divTwo');

    const link = document.createElement('a');
    link.classList.add(classname)
    link.href = href;
    link.classList.add('spectrum-Link', 'spectrum-Link--quiet');

    const textDiv = document.createElement('div');
    textDiv.classList.add(direction === 'left' ? 'icon-div' : 'divTwo_div');
    textDiv.textContent = title;

    link.innerHTML = createIconSvg(direction);
    link.appendChild(textDiv);

    container.appendChild(link);
    return container;
  }

  if (previousPage) {
    const leftDiv = document.createElement('div');
    leftDiv.classList.add('inner-emptyDiv');
    Prev_one.appendChild(leftDiv);
    leftDiv.appendChild(createLink(previousPage?.href, previousPage?.title, 'left', 'previous-page'));
  }

  if (nextPage) {
    const rightDiv = document.createElement('div');
    rightDiv.classList.add('inner-emptyDiv-two');
    Prev_one.appendChild(rightDiv);
    rightDiv.appendChild(createLink(nextPage.href, nextPage.title, 'right', 'nextPage'));
  }


}