import decoratePreformattedCode from '../../components/code.js';

export default function decorate(block) {
  const pre = document.createElement('pre');
  const code = block.querySelector('code');
  code.parentElement.replaceChild(pre, code);
  pre.appendChild(code);
  decoratePreformattedCode({ block, language: 'none' });
}
