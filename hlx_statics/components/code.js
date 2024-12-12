import { toClassName } from '../scripts/lib-helix.js';

function getLanguageDecorateCode(code) {
  return 'none';
  // TODO - connector is stripping out the language, so nothing to parse here
  // const index = code.innerHTML.indexOf('\n');
  // const language = code.innerHTML.substring(0, index);
  // code.innerHTML = code.innerHTML.substring(index + 1, code.innerHTML.length);
  // return language;
}

export default function decoratePreformattedCode(block) {
  const pre = block.querySelector('pre');
  // see https://prismjs.com/plugins/line-numbers/#how-to-use
  pre.classList.add('line-numbers');

  const code = block.querySelector('code');
  const language = getLanguageDecorateCode(code);
  // see https://prismjs.com/#basic-usage
  code.classList.add(`language-${toClassName(language)}`);
  // see https://prismjs.com/plugins/copy-to-clipboard/#settings
  code.setAttribute('data-prismjs-copy', 'Copy');
  code.setAttribute('data-prismjs-copy-success', 'Copied to your clipboard');
  code.setAttribute('data-prismjs-copy-timeout', '3000');
}
