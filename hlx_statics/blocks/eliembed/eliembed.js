/*
 * Embed Block
 * Show videos and social posts directly on your page
 * https://www.hlx.live/developer/block-collection/embed
 */

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
import { decorateLightOrDark } from '../../scripts/lib-helix.js';

  const getDefaultEmbed = (url) => {const embedHTML = `<div style="left: 0; width: 55vw; height: 45vh; max-height: fit-content; position: relative; padding-bottom: 56.25%;">
      <iframe src="${url.href}" style="border: 0; top: 0; left: 0; width: 100%; height: 100%; position: absolute;" allowfullscreen=""
        scrolling="no" allow="encrypted-media" title="Content from ${url.hostname}" loading="lazy">
      </iframe>
    </div>`
    loadScript("https://www.instagram.com/embed.js");
    return embedHTML;
  };

  const embedYTShort = (url) => {
    const [, videoCode] = url.pathname.split('/shorts/');
   return  `
   <div style="left: 0; width: 55vw; height: 40vh; position: relative; padding-bottom: 56.25%;">
   <iframe 
    src="https://www.youtube.com/embed/${videoCode}"
    title="YouTube video player"
    frameborder="0"
    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
    allowfullscreen></iframe>
    </div>`

  };
  
  const embedYoutube = (url) => {
    const usp = new URLSearchParams(url.search);
    let vid = encodeURIComponent(usp.get('v'));
    const embed = url.pathname;
    if (embed.includes('shorts')) {
      return embedYTShort(url);
    }
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
  
  const embedVimeo = (url) => {
    const [, video] = url.pathname.split('/');
    // const suffix = autoplay ? '?muted=1&autoplay=1' : '';
    const suffix = '';
    const embedHTML = `<div style="left: 0; width: 100%; height: 0; position: relative; padding-bottom: 56.25%;">
        <iframe src="https://player.vimeo.com/video/${video}${suffix}" 
        style="border: 0; top: 0; left: 0; width: 100%; height: 100%; position: absolute;" 
        frameborder="0" allow="autoplay; picture-in-picture"  
        title="Content from Vimeo" loading="lazy"></iframe>
      </div>`;
    return embedHTML;
  };
  'https://youtube.com/shorts/AMBUlU9qB90?si=xl1WFF1Hqjh3ZmVJ'
  const embedTwitter = (url) => {
    const embedHTML = `<blockquote class="twitter-tweet"><a href="${url.href}"></a></blockquote>`;
    loadScript('https://platform.twitter.com/widgets.js');
    return embedHTML;
  };

  const embedYTPlaylist = (url) => {
    `
    <div style="left: 0; width: 55vw; height: 40vh; position: relative; padding-bottom: 56.25%;">
    <iframe width="560" height="315" src="https://www.youtube.com/embed/videoseries?si=RrqPOeUfYAma41bn&amp;list=PLPFzKsPt50V8azAzY0Sg2go23AL9nuAAF" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
    </div>
    `
  }


  
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
        match: ['twitter'],
        embed: embedTwitter,
      },
    ];
    const config = EMBEDS_CONFIG.find((e) => e.match.some((match) => link.includes(match)));
    const url = new URL(link);
    if (config) {
      block.innerHTML = config.embed(url);
      block.classList = `block embed embed-${config.match[0]}`;
    } else {
      block.innerHTML = getDefaultEmbed(url);
      block.classList = 'block embed';
    }
    block.classList.add('embed-is-loaded');
    // const videoListener = () => {
    //   const iframe = block.querySelector('iframe');
    //   if (!iframe.src) {
    //     iframe.src = iframe.getAttribute('data-src');
    //     iframe.onload = () => { iframe.style.opacity = 1; };
    //   }
    //   block.removeEventListener('mouseover', videoListener);
    // };
    // block.addEventListener('mouseover', videoListener);
    const wid = block?.parentElement?.parentElement?.getAttribute('data-width');
    if (wid) {
      block.classList.add('embed-custom-width');
      block.firstChild.firstChild.style.width = wid;
    }
  };
  
  export default function decorate(block) {
    const link = block.querySelector('a').href;
      loadEmbed(block, link);
  }

'https://www.instagram.com/reel/C8XFzcxsXQ3/?utm_source=ig_web_copy_link'

