/*
 * Embed Block
 * Show videos and social posts directly on your page
 * https://www.hlx.live/developer/block-collection/embed
 */

const embedYoutube = (url) => {
  const usp = new URLSearchParams(url.search);
  let vid = encodeURIComponent(usp.get('v'));
  const embed = url.pathname;
  if (url.origin.includes('youtu.be')) {
    [, vid] = url.pathname.split('/');
  }
  const embedHTML = `<div style="left: 0; width: 100%; height: 0; position: relative; padding-bottom: 56.25%;">
    <iframe src="https://www.youtube.com${vid ? `/embed/${vid}?rel=0&amp;v=${vid}` : embed}" style="border: 0; top: 0; left: 0; width: 100%; height: 100%; position: absolute;" allow="encrypted-media; accelerometer; gyroscope; picture-in-picture" allowfullscreen="" scrolling="no" title="Content from Youtube" loading="lazy"></iframe>
    </div>`;
  return embedHTML;
};

const loadEmbed = (block, a) => {
  if (block.classList.contains('embed-is-loaded')) {
    return;
  }
  const link = a.href;
  const url = new URL(link);
  a.insertAdjacentHTML('afterend', embedYoutube(url));
  block.classList = 'block embed embed-youtube';
  a.remove();
  block.classList.add('embed-is-loaded');
  block.parentElement.parentElement.classList.add('spectrum--lightest');
};

/**
 * Decorates the embed
 * @param {*} block The embed block
 */
export default async function decorate(block) {
  const a = block.querySelector('a');//.href;
  const observer = new IntersectionObserver((entries) => {
    if (entries.some((e) => e.isIntersecting)) {
      observer.disconnect();
      loadEmbed(block, a);
    }
  });
  observer.observe(block);
}
