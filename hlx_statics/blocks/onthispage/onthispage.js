/**
 * decorates the title
 * @param {Element} block The title block element {Parameter Type} Name of the Parameter
 */
export default async function decorate(block) {
    const section = document.querySelector('.hero-container');
    section.style.display = "block";
    const onThisPageWrapper = document.querySelector('.onthispage-wrapper');
    const parentContainer = document.createElement('div');
    parentContainer.classList.add('parent-container');
    section.parentNode.insertBefore(parentContainer, section);
    parentContainer.appendChild(section);
    parentContainer.appendChild(onThisPageWrapper);

    const headings = Array.from(document.querySelectorAll('main h1[id], main h2[id], main h3[id], main h4[id], main h5[id], main h6[id]'));
    const paragraphs = document.querySelectorAll('.onthispage-wrapper p');
    
    const normalizeText = (text) => text?.trim()?.toLowerCase()?.replaceAll(" ", "");
    
    const handleParagraphClick = (paragraph, scroll = true) => {        
        const targetText = normalizeText(paragraph.textContent);
        const targetElement = headings.find(el => normalizeText(el.textContent) === targetText);
        
        if (targetElement) {
            const id = targetElement.getAttribute('id');
            if (id) {
                const targetAnchor = document.getElementById(id);
                if (targetAnchor) {
                    if (scroll) {
                        targetAnchor.scrollIntoView({ behavior: 'smooth' });
                    }
                    paragraphs.forEach(p => p.classList.remove('active'));
                    paragraph.classList.add('active');
                }
            }
        }
    };
    
    paragraphs.forEach(paragraph => {
        paragraph.addEventListener('click', () => handleParagraphClick(paragraph));
    });

    if (paragraphs.length > 0) {
        handleParagraphClick(paragraphs[0], false);
    }

    window.addEventListener('scroll', () => {
        let lastVisibleHeading = null;

        for (const heading of headings) {
            const rect = heading.getBoundingClientRect();
            if (rect.top >= 0 && rect.bottom <= window.innerHeight) {
                lastVisibleHeading = heading;
                break;
            } else if (rect.top < window.innerHeight && rect.bottom >= 0) {
                lastVisibleHeading = heading;
            }
        }

        if (lastVisibleHeading) {
            const targetText = normalizeText(lastVisibleHeading.textContent);
            const correspondingParagraph = Array.from(paragraphs).find(p => normalizeText(p.textContent) === targetText);

            if (correspondingParagraph) {
                paragraphs.forEach(p => p.classList.remove('active'));
                correspondingParagraph.classList.add('active');
            }
        }
    });
}