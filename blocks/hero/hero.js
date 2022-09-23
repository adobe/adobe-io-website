/**
 * Rearranges the links into a hero-button-container div
 * @param {*} block The hero block element
 */
function rearrangeLinks(block) {
  const leftDiv = block.firstElementChild.firstElementChild;
  const heroButtonContainer = document.createElement('div');
  heroButtonContainer.classList.add('hero-button-container');
  leftDiv.querySelectorAll('p.button-container').forEach((p) => {
    heroButtonContainer.append(p);
  });
  leftDiv.append(heroButtonContainer);
}

/**
 * Decorates the links as Spectrum Buttons, removes extra HTML
 * @param {*} block The hero block element
 */
function decorateLinks(block) {
  rearrangeLinks(block);
  // Link decoration as Spectrum Buttons
  block.querySelectorAll('a').forEach((a) => {
    a.className = '';
    a.classList.add('spectrum-Button');
    a.target = '_blank';
    a.rel = 'noopener noreferrer';
    if (a.parentElement.tagName === 'STRONG') {
      // Primary
      a.classList.add('spectrum-Button--fill', 'spectrum-Button--accent', 'spectrum-Button--sizeM');
      const strong = a.parentNode;
      strong.parentNode.replaceChild(a, strong);
    } else {
      // Secondary
      a.classList.add('spectrum-Button--fill', 'spectrum-Button--secondary', 'spectrum-Button--sizeM');
    }
    // Inserts extra span to wrap the link text
    const span = document.createElement('span');
    span.textContent = a.textContent;
    span.classList.add('spectrum-Button-label');
    a.innerText = '';
    a.appendChild(span);
  });
}

/**
 * decorates the hero
 * @param {Element} block The hero block element
 */
export default async function decorate(block) {
  // Block decoration
  block.classList.add('spectrum--lightest');
  // H1 decoration
  block.querySelectorAll('h1').forEach((h1) => {
    h1.classList.add('spectrum-Heading', 'spectrum-Heading--sizeXXL', 'spectrum-Heading--serif');
  });
  // Removes content for span.icon
  block.querySelectorAll('span.icon').forEach((span) => {
    span.textContent = '';
  });
  // Link decoration
  decorateLinks(block);
  // Paragraph decoration
  block.querySelectorAll('p').forEach((p) => {
    if (p.innerText) {
      p.classList.add('spectrum-Body', 'spectrum-Body--sizeL');
    }
  });
}
