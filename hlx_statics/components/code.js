export default function decorateCode(block) {
  const pre = document.createElement('pre');
  // see https://prismjs.com/plugins/line-numbers/#how-to-use
  pre.classList.add('line-numbers');

  const code = block.querySelector('code');
  // see https://prismjs.com/#basic-usage
  code.classList.add('language-none');
  // see https://prismjs.com/plugins/copy-to-clipboard/#settings
  code.setAttribute('data-prismjs-copy', 'Copy');
  code.setAttribute('data-prismjs-copy-success', 'Copied to your clipboard');
  code.setAttribute('data-prismjs-copy-timeout', '3000');

  code.parentElement.replaceChild(pre, code);
  pre.appendChild(code);
}
