// eslint-disable-next-line import/no-cycle
import { sampleRUM } from './lib-helix.js';

// Core Web Vitals RUM collection
sampleRUM('cwv');

document.querySelectorAll('.embed').forEach((embed) => {
  const iframe = embed.querySelector('iframe');
  if (!iframe.src) {
    iframe.src = iframe.getAttribute('data-src');
    iframe.onload = () => { iframe.style.opacity = 1; };
  }
});
