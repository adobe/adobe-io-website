import { readBlockConfig } from '../../scripts/lib-helix.js';
import {
  createTag
} from '../../scripts/lib-adobeio.js';

function buildFooter(html) {
  const footer = createTag('div', { class: 'footer-links-container' });
  const footerInnerContainer = createTag('div', { class: 'footer-links-container-inner' });
  const horizontalDivider = createTag('div', { class: 'spectrum-Divider spectrum-Divider--sizeM footer-horizontal' });
  const footerLegal = createTag('div', { class: 'footer-legal' });
  footerInnerContainer.innerHTML = html;
  footerLegal.append(footerInnerContainer.querySelector('div:nth-child(5)'));
  footerLegal.append(footerInnerContainer.querySelector('div:nth-child(5)'));

  footerInnerContainer.querySelectorAll('div').forEach((footerColumn) => {
    const footerColumnWrapper = createTag('div');
    footerColumnWrapper.append(footerColumn);
    const footerDivider = createTag('div', { class: 'footer-divider' });
    const divider = createTag('div', { class: 'spectrum-Divider spectrum-Divider--sizeM spectrum-Divider--vertical' });
    divider.setAttribute('style', 'height: 100%; align-self: stretch;');
    footerDivider.append(divider);
    footerColumnWrapper.append(footerDivider);
    footerInnerContainer.append(footerColumnWrapper);
  });
  footerInnerContainer.querySelector('div:last-child > .footer-divider').remove();

  footer.append(footerInnerContainer);
  footer.append(horizontalDivider);
  footer.append(footerLegal);
  return footer;
}

/**
 * loads and decorates the footer
 * @param {Element} block The footer block element
 */

export default async function decorate(block) {
  block.setAttribute('daa-lh', 'footer');
  const cfg = readBlockConfig(block);
  block.textContent = '';
  const footerPath = cfg.footer || 'https://main--adobe-io-website--adobe.hlx.live/franklin_assets/footer';
  const resp = await fetch(`${footerPath}.plain.html`);
  const html = await resp.text();
  block.classList.add('footer-links-container');
  block.append(buildFooter(html));

  block.querySelectorAll('.footer-links-container-inner ul').forEach((ul) => {
    ul.className = 'spectrum-Body spectrum-Body--sizeS';
  });
  block.querySelectorAll('h3').forEach((h3) => {
    h3.className = 'spectrum-Heading--sizeXS';
  });
  block.querySelector('.footer-legal ul').className = 'spectrum-Body spectrum-Body--sizeXS';
  block.querySelectorAll('a').forEach((a) => {
    const className = a.parentElement.tagName === 'STRONG'
      ? 'spectrum-Link spectrum-Link--quiet'
      : 'spectrum-Link spectrum-Link--secondary spectrum-Link--quiet';
    a.className = className;
  });
  block.querySelectorAll('div.footer-legal > div > p').forEach((p) => {
    p.className = 'spectrum-Body spectrum-Body--sizeXS footer-date';
  });
}
