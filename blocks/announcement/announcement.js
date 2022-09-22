/**
 * decorates the announcement
 * @param {Element} block The announcement block element
 */
export default function decorate(block) {
  // Decorate h3
  block.querySelectorAll('h3').forEach((h3) => {
    h3.classList.add('spectrum-Heading', 'spectrum-Heading--sizeM', 'announce-heading');
  });
  // Transforms and decorates links into buttons
  block.querySelectorAll('p.button-container').forEach((p) => {
    p.classList.replace('button-container', 'announce-link');
    p.querySelectorAll('strong > a').forEach((a) => {
      a.target = '_blank';
      a.rel = 'noopener noreferrer';
      a.className = '';
      a.classList.add('spectrum-Button', 'spectrum-Button--fill', 'spectrum-Button--accent', 'spectrum-Button--sizeM');
      const span = document.createElement('span');
      span.className = 'spectrum-Button-label';
      span.innerText = a.innerText;
      a.innerText = '';
      a.append(span);
      const strong = a.parentNode;
      p.replaceChild(a, strong);
    });
  });
}
