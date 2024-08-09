/**
 * decorates the title
 * @param {Element} block The title block element {Parameter Type} Name of the Parameter
 */
export default async function decorate(block) {
    block.querySelectorAll('h4').forEach((h) => {
        h.style.color = 'rgb(109,109,109)';
    });
    const main = document.querySelector('main');
    const sideNav = document.querySelector('.side-nav-container');
    const footer = document.querySelector('.footer');
    const onThisPage = document.querySelector('.onthispage-container');

    // Create the new wrapper divs
    const parentContainer = document.createElement('div');
    parentContainer.className = 'parent-container';

    const innerContainer = document.createElement('div');
    innerContainer.className = 'inner-container';

    // Collect all children of main except sideNav and footer
    const elements = Array.from(main.children);
    elements.forEach(element => {
        if (element !== sideNav && element !== footer) {
            if (element !== onThisPage) {
                innerContainer.appendChild(element);
            }
        }
    });
    parentContainer.style.display = "flex";
    // Append innerContainer to parentContainer
    parentContainer.appendChild(innerContainer);

    // Append onThisPage to parentContainer after innerContainer
    parentContainer.appendChild(onThisPage);

    // Insert parentContainer into main
    main.insertBefore(parentContainer, footer);

    const paragraphs = document.querySelectorAll('.onthispage-container p');
    const headings = Array.from(document.querySelectorAll('main h1, main h2, main h3, main h4, main h5, main h6'));
    // Function to normalize text content for comparison
    const normalizeText = (text) => text?.trim()?.toLowerCase()?.replaceAll(" ","");

    // Function to handle scrolling and activating paragraph
    const handleParagraphClick = (paragraph) => {
        const targetText = normalizeText(paragraph.textContent);
        const targetElement = headings.find(el => normalizeText(el.textContent) === targetText);
        if (targetElement) {
            const parentElement = targetElement.parentElement;  
            parentElement.scrollIntoView({ behavior: 'smooth' });
            paragraphs.forEach(p => p.classList.remove('active'));
            paragraph.classList.add('active');
        }
    };

    // Attach click event listeners
    paragraphs.forEach(paragraph => {
        paragraph.addEventListener('click', () => handleParagraphClick(paragraph));
    });

    // Initially scroll to and activate the first paragraph
    if (paragraphs.length > 0) {
        handleParagraphClick(paragraphs[0]);
    }
}