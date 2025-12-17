import decoratePreformattedCode, { applyLanguageDirectives, extractLanguageDirectives } from '../../components/code.js';

export default function decorate(block) {
  const language = extractLanguageDirectives(block);
  const code = block.querySelector('code');
  const pre = document.createElement('pre');
  code.parentElement.replaceChild(pre, code);
  pre.appendChild(code);
  if (language) {
    applyLanguageDirectives(pre, code, language);
  }
  decoratePreformattedCode(block);
}
