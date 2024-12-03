import { applyBkgColorOverride,  decorateButtons} from '../../scripts/lib-adobeio.js';

/**
 * decorates the title
 * @param {Element} block The title block element {Parameter Type} Name of the Parameter
 */
export default async function decorate(block) {
  decorateButtons(block);
  applyBkgColorOverride(block);
  

  const fontcolor = block?.parentElement?.parentElement?.getAttribute('data-fontcolor');
  block.setAttribute('daa-lh', 'profile-card');
  block.querySelectorAll('h1, h2, h3, h4, h5, h6').forEach((h) => {
    h.classList.add('spectrum-Heading', 'spectrum-Heading--sizeL', 'title-heading');
    h.style.color = fontcolor;
  });
  block.querySelectorAll('p').forEach((p) => {
    p.classList.add('spectrum-Body', 'spectrum-Body--sizeL');
    p.style.color = fontcolor;
  });

  Array.from(block.children).forEach((div)=>{
    const newDiv=document.createElement('div');
    newDiv.classList.add('all-button-container')
  
    div.lastElementChild.querySelectorAll('.button-container').forEach((p)=>{
      newDiv.append(p);
    })
    
    div.lastElementChild.append(newDiv)
  })
} 