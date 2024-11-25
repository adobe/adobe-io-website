import decoratePreformattedCode from '../../components/code.js';

export default function decorate(block) {
  // const codeCssFilePath = "/hlx_statics/blocks/code/code.css"
  // if (!document.querySelector(`link[href="${codeCssFilePath}"]`)) {
  //   const link = document.createElement('link');
  //   link.rel = 'stylesheet';
  //   link.href = codeCssFilePath;
  //   document.head.appendChild(link);
  // }

  const pre = document.createElement('pre');
  const code = block.querySelector('code');
  code.parentElement.replaceChild(pre, code);
  pre.appendChild(code);
  decoratePreformattedCode({ block, language: 'none' });
}
