/*
 * Embed Block
 * Show videos and social posts directly on your page
 * https://www.hlx.live/developer/block-collection/embed
 */
import { decorateLightOrDark } from '../../scripts/lib-helix.js';

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

const getDefaultEmbed = (url, loop, controls, vidTitle) => {
  const embedHTML = `<div style="left: 0; width: 55vw; height: 45vh; max-height: fit-content; position: relative; padding-bottom: 56.25%;">
    <iframe src="${url.href}?${loop ? `loop=1&` : ``}${controls ? `controls=1`: ``}autoplay=0&mute=0&" 
    style="border: 0; top: 0; left: 0; width: 100%; height: 100%; position: absolute;" allowfullscreen=""
      scrolling="no" allow="encrypted-media" title=${vidTitle ? vidTitle : `Content from ${url.hostname}`} loading="lazy">
    </iframe>
  </div>`;
  return embedHTML;
};

const embedIG = (url, loop, controls, vidTitle) => {
  const link = url.href.split('?')[0] + 'embed/captioned';
  const embedHTML = `<div class="igReel">
  <iframe src="${link}" style="border: 0; top: 0; left: 0; width: 100%; height: 100%; position: absolute;" allowfullscreen=""
    scrolling="no" allow="encrypted-media" title=${vidTitle ? vidTitle : `Content from ${url.hostname}`} loading="lazy">
  </iframe>
</div>`;
loadScript("https://www.instagram.com/embed.js");
return embedHTML;
};

const embedYTShort = (url, loop, controls, vidTitle) => {
  const [, videoCode] = url.pathname.split('/shorts/');
 return  `
 <div style="width: 75vw; height: 40vh; position: relative; padding-bottom: 56.25%;">
  <iframe 
    src="https://www.youtube.com/embed/${videoCode}/?playlist=${videoCode}&loop=${loop}&controls=${controls}"
    title=${vidTitle ? vidTitle : `Content from ${url.hostname}`}
    frameborder="0"
    loading="lazy"
    allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
    allowfullscreen></iframe>
</div>`;
};

const embedMP4 = (url, loop, controls, vidTitle) => {
  const video = `
<div style=" width: 100%;">
      <video src="${url}" ${loop ? "loop" : ""} ${controls ? "controls":""} style="width: 100%; height: 100%;"> 
      <p>Sorry, We're having an internal Error. Please try Again Soon!</p>
      </video>
</div>
  `;
  return  video;
};
const embedYTPlaylist = (usp, loop, controls, vidTitle) => {
  const source = `"https://www.youtube.com${`/embed/videoseries/?list=${usp.get('list')}`}&loop=${loop}&controls=${controls}";`
  const embedHTML = `<div style="left: 0; width: 100%; height: 100%; position: relative; padding-bottom: 56.25%;">
  <iframe 
  style="opacity: 1" src=${source} data-src=${source} allow="encrypted-media; accelerometer; gyroscope; picture-in-picture" allowfullscreen=""
  title=${vidTitle ? vidTitle : `Content from Youtube`} scrolling="no">
   </iframe>
  </div>`;
  return embedHTML;
  
}
const embedTikTok = (url, loop, controls, vidTitle) => {
  const [, vidID] = url.pathname.split('video/')
  return  `<div style="left: 0; width: 325px; height: 736px;  position: relative;">
    <iframe src="https://www.tiktok.com/embed/${vidID}"style="border: 0; top: 0; left: 0; width: 100%; height: 736px; position: absolute;" allowfullscreen=""
      scrolling="no" allow="accelerometer encrypted-media" title=${vidTitle ? vidTitle : `Content from ${url.hostname}`} loading="lazy">
    </iframe>
  </div>`;
}

const embedYoutube = (url, loop, controls, vidTitle) => {
  const usp = new URLSearchParams(url.search);
  let vid = encodeURIComponent(usp.get('v'));
  const embed = url.pathname;
  if (embed.includes('shorts')) {
    return embedYTShort(url, loop, controls);
  }
  if (embed.includes('playlist')) {
    return embedYTPlaylist(usp, loop, controls);
  }
  if (url.origin.includes('youtu.be')) {
    [, vid] = url.pathname.split('/');
  }
  const embedHTML = `<div style="left: 0; width: 100%; height: 100%; position: relative; padding-bottom: 56.25%;">
        <iframe src="https://www.youtube.com${vid ? `/embed/${vid}?playlist=${vid}&amp;` : embed}loop=${loop}&controls=${controls}" 
        data-src="https://www.youtube.com${vid ? `/embed/${vid}?playlist=${vid}&amp;` : embed}loop=${loop}&controls=${controls}" 
        allow="encrypted-media; accelerometer; gyroscope; picture-in-picture" allowfullscreen="" 
        scrolling="no" title=${vidTitle ? vidTitle : `Content from ${url.hostname}`} loading="lazy">
        <p> Sorry, we're having an internal error. Try again later. <//p>
        </iframe>
    </img>
  </div>`;
  return embedHTML;
};

const embedVimeo = (url, loop, controls, vidTitle) => {
  const [, video] = url.pathname.split('/');
  const embedHTML = `<div style="left: 0; width: 100%; height: 100%; position: relative; padding-bottom: 56.25%;">
      <iframe src="https://player.vimeo.com/video/${video}?loop=${loop}&controls=${controls}" 
      style="border: 0; top: 0; left: 0; width: 100%; height: 100%; position: absolute;" 
      frameborder="0" allow="fullscreen; encrypted-media; accelerometer; gyroscope; picture-in-picture"  
      allowfullscreen=""
      title=${vidTitle ? vidTitle : `Content from ${url.hostname}`} loading="lazy"></iframe>
    </div>`;
  return embedHTML;
};
const embedTwitter = (url, loop, controls, vidTitle) => {
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
  // Initially set so that looping does not occur, but user can view the controls
  let loop = 0;
  let controls = 1;
  const attrs = block?.parentElement?.parentElement?.attributes;
  const vidTitle = attrs?.getNamedItem('data-videotitle')?.value;
  // changes the values of these attributes based on section metadata
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
    block.innerHTML = config.embed(url, loop, controls, vidTitle);
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
  const wid = block?.parentElement?.parentElement?.getAttribute('data-width');
  if (wid) {
    block.classList.add('embed-custom-width');
    block.firstChild.firstChild.style.width = wid;
  }
};

const addImage = (placeholder, block, link) => {
  const wrapper = document.createElement('div');
    wrapper.className = 'embed-placeholder';
    wrapper.innerHTML = '<div class="embed-placeholder-play"><button type="button" title="Play"></button></div>';
    wrapper.prepend(placeholder);
    wrapper.addEventListener('click', () => {
      loadEmbed(block, link, true);
    });
    block.append(wrapper);
};
export default function decorate(block) {
  const getParent = block.parentElement;
  block.setAttribute('daa-lh', 'embed');
  const placeholder = block.querySelector('picture');
  let link
  if (block.querySelector('a')?.href) {
    link = block.querySelector('a')?.href
  }
  else {
    link = block.querySelector('.embed > div > div').innerText;
    getParent.parentElement.classList.remove("embed-container");
    block.style.maxWidth = "800px";
  }

  block.textContent = '';
  if (placeholder) {
    if (!(placeholder.alt)) placeholder.alt = "Content thumbnail";
    addImage(placeholder, block, link);
  } 
  else {
    loadEmbed(block, link);
  }
}