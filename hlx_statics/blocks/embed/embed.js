/*
 * Embed Block
 * Show videos and social posts directly on your page
 * https://www.hlx.live/developer/block-collection/embed
 */

import { decorateLightOrDark } from '../../scripts/lib-helix.js';
import { applyBkgColorOverride, applyAnalyticHeaderOverride } from '../../scripts/lib-adobeio.js';

/**
 * Gets the video id from the authored URL and inserts the Youtube embed
 * The iframe is not loaded until the users moves the pointer over the thumbnail image
 * Or eventually with a delay of 3 seconds (see delayed.js)
 * @param {*} url The authored URL
 * @returns The HTML to embed
 */
const embedYoutube = (url) => {
  const usp = new URLSearchParams(url.search);
  let vid = encodeURIComponent(usp.get('v'));
  const embed = url.pathname;
  if (url.origin.includes('youtu.be')) {
    [, vid] = url.pathname.split('/');
  }
  const embedHTML = `<div style="left: 0; width: 100%; height: 0; position: relative; padding-bottom: 56.25%;">
    <img loading="lazy" style="border: 0; top: 0; left: 0; width: 100%; height: 100%; position: absolute;"
      src="https://i.ytimg.com/vi_webp/${vid}/maxresdefault.webp">
        <iframe data-src="https://www.youtube.com${vid ? `/embed/${vid}?rel=0&amp;v=${vid}` : embed}" allow="encrypted-media; accelerometer; gyroscope; picture-in-picture" allowfullscreen="" scrolling="no" title="Content from Youtube" loading="lazy"></iframe>
    </img>
  </div>`;
  return embedHTML;
};

/**
 * Decorates the block with the embedded HTML
 * Sets the event listener for pointer over thumbnail image
 * @param {*} block The block to decorate
 * @param {*} a The authored link
 * @returns Exits early if the embed is already loaded
 */
const loadEmbed = (block, a) => {
  if (block.classList.contains('embed-is-loaded')) {
    return;
  }
  decorateLightOrDark(block, true);
  block.className = 'block embed embed-youtube';
  const link = a.href;
  const url = new URL(link);
  a.insertAdjacentHTML('afterend', embedYoutube(url));
  a.remove();
  block.classList.add('embed-is-loaded');

  const videoListener = () => {
    const iframe = block.querySelector('iframe');
    if (!iframe.src) {
      iframe.src = iframe.getAttribute('data-src');
      iframe.onload = () => { iframe.style.opacity = 1; };
    }
    block.removeEventListener('mouseover', videoListener);
  };
  block.addEventListener('mouseover', videoListener);
  applyBkgColorOverride(block);
  const wid = block?.parentElement?.parentElement?.getAttribute('data-width');
  if (wid) {
    block.classList.add('embed-custom-width');
    block.firstChild.firstChild.style.width = wid;
  }
};

/**
 * Decorates the embed
 * @param {*} block The embed block
 */
export default async function decorate(block) {
  block.setAttribute('daa-lh', 'embed');
  applyAnalyticHeaderOverride(block);
  const a = block.querySelector('a');
  loadEmbed(block, a);
}
