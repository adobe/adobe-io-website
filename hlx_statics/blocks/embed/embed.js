/*
 * Embed Block
 * Show videos and social posts directly on your page
 * https://www.hlx.live/developer/block-collection/embed
 */
import { decorateLightOrDark } from '../../scripts/lib-helix.js';
import { applyBkgColorOverride, applyAnalyticHeaderOverride } from '../../scripts/lib-adobeio.js';

const loadScript = (url, callback, type) => {
  const head = document.querySelector('head');
  const script = document.createElement('script');
  script.src = url;
  if (type) {
    script.setAttribute('type', type);
  }
  script.onload = callback;
  head.append(script);
  return script;
};

const getDefaultEmbed = (url, autoplay, loop, controls) => {
  const embedHTML = `<div style="left: 0; width: 55vw; height: 45vh; max-height: fit-content; position: relative; padding-bottom: 56.25%;">
    <iframe src="${url.href}?${autoplay ? `autoplay=1&mute=1&`:``}${loop ? `loop=1&` : ``}${controls ? `controls=1`: ``}" 
    style="border: 0; top: 0; left: 0; width: 100%; height: 100%; position: absolute;" allowfullscreen=""
      scrolling="no" allow="encrypted-media" title="Content from ${url.hostname}" loading="lazy">
    </iframe>
  </div>`;
  return embedHTML;
};

const embedIG = (url, autoplay, loop, controls) => {
  const link = url.href.split('?')[0] + 'embed/captioned';
  const embedHTML = `<div style="left: 0; width: 75vw; height: 45vh; max-height: fit-content; position: relative; padding-bottom: 56.25%;">
  <iframe src="${link}" style="border: 0; top: 0; left: 0; width: 100%; height: 100%; position: absolute;" allowfullscreen=""
    scrolling="no" allow="encrypted-media" title="Content from ${url.hostname}" loading="lazy">
  </iframe>
</div>`;
loadScript("https://www.instagram.com/embed.js");
return embedHTML;
};

const embedYTShort = (url, autoplay, loop, controls) => {
  const [, videoCode] = url.pathname.split('/shorts/');
 return  `
 <div style="width: 75vw; height: 40vh; position: relative; padding-bottom: 56.25%;">
  <iframe 
    src="https://www.youtube.com/embed/${videoCode}/?playlist=${videoCode}&autoplay=${autoplay}&muted=${autoplay}&loop=${loop}&controls=${controls}"
    title="YouTube video player"
    frameborder="0"
    loading="lazy"
    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
    allowfullscreen></iframe>
</div>`;
  
};
const embedMP4 = (url, autoplay, loop, controls) => {
  const video = `
<div style=" width: 100%;">
      <video src="${url}" ${autoplay ? "autoplay muted":""} ${loop ? "loop" : ""} ${controls ? "controls":""} style="width: 100%; height: 100%;"> 
      Sorry, We're having an internal Error. Please try Again Soon!
      </video>
</div>
  `;
  return  video;
};
const embedYTPlaylist = (usp, autoplay, loop, controls) => {
  const source = `"https://www.youtube.com${`/embed/videoseries/?list=${usp.get('list')}`}&autoplay=${autoplay}&muted=${autoplay}&loop=${loop}&controls=${controls}";`
  const embedHTML = `<div style="left: 0; width: 100%; height: 0; position: relative; padding-bottom: 56.25%;">
  <iframe 
  style="opacity: 1" src=${source} data-src=${source} allow="autoplay; encrypted-media; accelerometer; gyroscope; picture-in-picture" allowfullscreen=""
   scrolling="no" title="Content from Youtube" loading="lazy">
   </iframe>
  </div>`;
  return embedHTML;
  
}
const embedTikTok = (url, autoplay, loop) => {
  const [, vidID] = url.pathname.split('video/')
  return  `<div style="left: 0; width: 325px; height: 736px;  position: relative;">
    <iframe src="https://www.tiktok.com/embed/${vidID}"style="border: 0; top: 0; left: 0; width: 100%; height: 736px; position: absolute;" allowfullscreen=""
      scrolling="no" allow="autoplay encrypted-media" title="Content from ${url.hostname}" loading="lazy">
    </iframe>
  </div>`;
}

const embedYoutube = (url, autoplay, loop, controls) => {
  const usp = new URLSearchParams(url.search);
  let vid = encodeURIComponent(usp.get('v'));
  const embed = url.pathname;
  if (embed.includes('shorts')) {
    return embedYTShort(url, autoplay, loop, controls);
  }
  if (embed.includes('playlist')) {
    return embedYTPlaylist(usp, autoplay, loop, controls);
  }
  if (url.origin.includes('youtu.be')) {
    [, vid] = url.pathname.split('/');
  }
  const embedHTML = `<div style="left: 0; width: 100%; height: 0; position: relative; padding-bottom: 56.25%;">
    <img loading="lazy" style="border: 0; top: 0; left: 0; width: 100%; height: 100%; position: absolute;"
      src="https://i.ytimg.com/vi_webp/${vid}/maxresdefault.webp">
        <iframe data-src="https://www.youtube.com${vid ? `/embed/${vid}?playlist=${vid}&amp;` : embed}autoplay=${autoplay}&muted=${autoplay}&loop=${loop}&controls=${controls}" 
        allow="autoplay; encrypted-media; accelerometer; gyroscope; picture-in-picture" allowfullscreen="" scrolling="no" title="Content from Youtube" loading="lazy">
        </iframe>
    </img>
  </div>`;
  return embedHTML;
};

const embedVimeo = (url, autoplay, loop, controls) => {
  const [, video] = url.pathname.split('/');
  const embedHTML = `<div style="left: 0; width: 100%; height: 0; position: relative; padding-bottom: 56.25%;">
      <iframe src="https://player.vimeo.com/video/${video}?autoplay=${autoplay}&muted=${autoplay}&loop=${loop}&controls=${controls}" 
      style="border: 0; top: 0; left: 0; width: 100%; height: 100%; position: absolute;" 
      frameborder="0" allow="fullscreen; autoplay; encrypted-media; accelerometer; gyroscope; picture-in-picture"  
      allowfullscreen=""
      title="Content from Vimeo" loading="lazy"></iframe>
    </div>`;
  return embedHTML;
};
const embedTwitter = (url, autoplay, loop, controls) => {
  const source = url.protocol+"//twitter.com"+url.pathname+ (url.search ? url.search : "");
  const embedHTML = `<blockquote class="twitter-tweet"><a href="${source}"></a></blockquote>`;
  loadScript('https://platform.twitter.com/widgets.js');
  return embedHTML;
};


const loadEmbed = (block, link) => {
  if (block.classList.contains('embed-is-loaded')) {
    return;
  }
  decorateLightOrDark(block, true);    
  const EMBEDS_CONFIG = [
    {
      match: ['youtube', 'youtu.be'],
      embed: embedYoutube,
    },
    {
      match: ['vimeo'],
      embed: embedVimeo,
    },
    {
      match: ['twitter', 'x.com'],
      embed: embedTwitter,
    },
    {
      match: ['insta'],
      embed: embedIG,
    },
    {
      match: ['tiktok'],
      embed: embedTikTok,
    },
    {
      match: ['mp4'],
      embed: embedMP4,
    },
  ];
  const config = EMBEDS_CONFIG.find((e) => e.match.some((match) => link.includes(match)));
  // Initially set so that autoplay and looping does not occur, but user can view the controls
  let autoplay = 0;
  let loop = 0;
  let controls = 1;
  const attrs = block?.parentElement?.parentElement?.attributes
  // changes the values of these attributes based on section metadata
  if (attrs?.getNamedItem('data-autoplay'))
  {
    autoplay = (attrs.getNamedItem('data-autoplay').value.toLowerCase()  === 'true') ? 1: 0;
  }
  if (attrs?.getNamedItem('data-loop'))
  {
    loop = (attrs.getNamedItem('data-loop').value.toLowerCase()  === 'true') ? 1: 0;
  }
  if (attrs?.getNamedItem('data-controls'))
  {
    controls = (attrs.getNamedItem('data-controls').value.toLowerCase()  === 'true') ? 1: 0;
  }
  const url = new URL(link);
  if (config) {
    block.innerHTML = config.embed(url, autoplay, loop, controls);
    block.classList = `block embed embed-${config.match[0]}`;
  } else {
    block.innerHTML = getDefaultEmbed(url);
    block.classList = 'block embed';
  }
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

export default function decorate(block) {
  block.setAttribute('daa-lh', 'embed');
  applyAnalyticHeaderOverride(block);
  const link = block.querySelector('a').href;
  loadEmbed(block, link);
}