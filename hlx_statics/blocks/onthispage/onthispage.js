
/**
 * Decorates the onthispage block.
 * @param {Element} block The onthispage block element.
 */
export default async function decorate(block) {

    const mainContainer = document.querySelector('main');
    const headings = mainContainer.querySelectorAll('h2, h3');
    const aside = mainContainer.querySelector('.onthispage-wrapper > aside');
    Object.assign(aside.style, {
        display: 'flex',
        flexDirection: 'column',
        rowGap: '10px',
        width: '200px'
    });
    
    const onthispageHeader = document.createElement('h4');
    onthispageHeader.classList.add('onthispage-header');
    onthispageHeader.textContent = 'ON THIS PAGE';
    aside.appendChild(onthispageHeader);
    
    const anchors = [];
    let isScrolling = false;
    
    headings.forEach((heading, index) => {
        const textContent = heading.textContent.trim();
        const anchorText = textContent.replace(/\s+/g, '-').replace(/[()]/g, '').toLowerCase();
        const anchor = document.createElement('a');
        anchor.href = `#${anchorText}`;
        anchor.textContent = textContent;
        aside.appendChild(anchor);
        anchors.push(anchor);
    
        if (heading.tagName === 'H3') {
            anchor.style.paddingLeft = '16px';
        }
        heading.id = anchorText;
        if (index === 0) {
            anchor.classList.add('active');
        }
    });
    
    const observer = new IntersectionObserver((entries) => {
        if (isScrolling) return;
        let maxVisibleSection = null;
        let maxVisibleHeight = 0;
    
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const visibleHeight = Math.min(entry.target.getBoundingClientRect().bottom, window.innerHeight) -
                    Math.max(entry.target.getBoundingClientRect().top, 0);
    
                if (visibleHeight > maxVisibleHeight) {
                    maxVisibleHeight = visibleHeight;
                    maxVisibleSection = entry.target;
                }
            }
        });
    
        if (maxVisibleSection) {
            const id = maxVisibleSection.id;
            const correspondingAnchor = anchors.find(anchor => anchor.getAttribute('href') === `#${id}`);
            if (correspondingAnchor) {
                anchors.forEach(anchor => anchor.classList.remove('active'));
                correspondingAnchor.classList.add('active');
            }
        }
    }, {
        threshold: 0.3,
        rootMargin: '-20% 0px -20% 0px',
    });
    
    headings.forEach(section => observer.observe(section));
    
    anchors.forEach(anchor => {
        anchor.addEventListener('click', (event) => {
            event.preventDefault();
            isScrolling = true;
            anchors.forEach(a => a.classList.remove('active'));
            event.target.classList.add('active');
            const targetId = event.target.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({ behavior: 'smooth' });
            }
            setTimeout(() => {
                isScrolling = false;
            }, 500);
        });
    });
    
}
