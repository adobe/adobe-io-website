import createDivider from './divider.js';
import decorateLink from './link.js';
import { createAnchorLink } from '../scripts/lib-adobeio.js';

const headingSizes = ['XL', 'M', 'S', 'XS', 'XXS', 'XXS'];

// Use the Anchor to allow scrolling to heading position minus GlobalNav height
function Anchor({ id }) {
  const div = document.createElement('div');
  div.setAttribute('aria-hidden', 'true');
  div.setAttribute('id', id);
  div.style.setProperty('position', 'relative');
  div.style.setProperty('top', 'calc(-1 * var(--spectrum-global-dimension-size-800)');
  return div;
}

export default function decorateHeading({ level, block }) {
  const HeadingTag = `h${level}`;
  const isHeading1 = level === 1;
  const isHeading2 = level === 2;

  block.querySelectorAll(HeadingTag).forEach((heading) => {
    if (!isHeading1) {
      const anchor = Anchor({ id: heading.id });
      heading.parentElement.insertBefore(anchor, heading);
    }

    heading.classList.add('spectrum-Heading', `spectrum-Heading--size${headingSizes[level - 1]}`);
    if (isHeading1) {
      heading.classList.add('spectrum-Heading--light');
    }

    if (!isHeading1) {
      const span = document.createElement('span');
      span.style.marginLeft = `var(--spectrum-global-dimension-size-${isHeading2 ? '100' : '50'})`;
      heading.appendChild(span);

      const a = createAnchorLink(heading.id);
      decorateLink({ link: a });
      span.appendChild(a);
    }

    if (isHeading2) {
      const divider = createDivider({ size: 'S', style: { 'margin-bottom': 'calc(-1 * var(--spectrum-global-dimension-size-75)' , 'width' : '100%' } });
      heading.parentElement.insertBefore(divider, heading.nextSibling);
    }
  });
}
