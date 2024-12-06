import { toClassName } from '../scripts/lib-helix.js';

export default function decoratePreformattedCode({ block, language }) {
  const pre = block.querySelector('pre');
  // see https://prismjs.com/plugins/line-numbers/#how-to-use
  pre.classList.add('line-numbers');

  const code = block.querySelector('code');
  // see https://prismjs.com/#basic-usage
  code.classList.add(`language-${toClassName(language)}`);
  // see https://prismjs.com/plugins/copy-to-clipboard/#settings
  code.setAttribute('data-prismjs-copy', 'Copy');
  code.setAttribute('data-prismjs-copy-success', 'Copied to your clipboard');
  code.setAttribute('data-prismjs-copy-timeout', '3000');
}

export function getLanguageDecorateCode({ code }) {
  const index = code.innerHTML.indexOf('\n');
  const language = code.innerHTML.substring(0, index);
  code.innerHTML = code.innerHTML.substring(index + 1, code.innerHTML.length);
  return language;
}