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
    const footer = document.querySelector('footer-wrapper');
    const onThisPage = document.querySelector('.onthispage-container');
    const paragraphs = document.querySelectorAll('.onthispage-container p');
    const headings = Array.from(document.querySelectorAll('main h1[id], main h2[id], main h3[id], main h4[id], main h5[id], main h6[id]'));

    // Function to normalize text content for comparison
    const normalizeText = (text) => text?.trim()?.toLowerCase()?.replaceAll(" ", "");

    const parentContainer = document.createElement('div');
    parentContainer.className = 'parent-container';

    const innerContainer = document.createElement('div');
    innerContainer.className = 'inner-container';

    // Create the new wrapper divs
    const onthispageParentContainer = document.createElement('div');
    onthispageParentContainer.classList.add('mainwrapper');
    sideNav.classList.add('sidenav');
    innerContainer.classList.add('maingridwrapper');

    // Collect all children of main except sideNav and footer
    const elements = Array.from(main.children);
    elements.forEach(element => {

        if (element !== sideNav && element !== footer) {
            if (element !== sideNav) {
                innerContainer.appendChild(element);
            }
        }
    });
    innerContainer.style.display = "flex";
    const handleParagraphClick = (paragraph) => {
        const targetText = normalizeText(paragraph.textContent);
        const targetElement = headings.find(el => normalizeText(el.textContent) === targetText);
        if (targetElement) {
            const id = targetElement.getAttribute('id');
            if (id) {
                const targetAnchor = document.getElementById(id);
                if (targetAnchor) {
                    targetAnchor.scrollIntoView({ behavior: 'smooth' });
                    paragraphs.forEach(p => p.classList.remove('active'));
                    paragraph.classList.add('active');
                }
            }
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

    onthispageParentContainer.appendChild(sideNav);
    onthispageParentContainer.appendChild(innerContainer);
    main.appendChild(onthispageParentContainer);
    main.appendChild(footer);
}