import { applyAnalyticHeaderOverride } from "../../scripts/lib-adobeio.js";

/**
 * Decorates the onthispage block.
 * @param {Element} block The onthispage block element.
 */
export default async function decorate(block) {
    const section = document.querySelector('main > div:not(.side-nav-container):not(.footer-wrapper)');
    section.style.display = "block";

    const onThisPageWrapper = document.querySelector('.onthispage-wrapper');
    const parentContainer = document.createElement('div');
    parentContainer.classList.add('parent-container');

    section.parentNode.insertBefore(parentContainer, section);
    parentContainer.append(section, onThisPageWrapper);

    const anchors = document.querySelectorAll('.onthispage-wrapper a');
    anchors[0]?.classList.add('active'); 
    anchors.forEach(anchor => {
        anchor.setAttribute('aria-label', `Jump to ${anchor?.innerText}`);
        anchor.setAttribute('rel', 'noopener noreferrer');
        anchor.setAttribute('target', '_self');
    });

    const sections = Array.from(document.querySelectorAll('main h1[id], main h2[id], main h3[id], main h4[id], main h5[id], main h6[id]'));

    const observer = new IntersectionObserver((entries) => {
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
            const correspondingAnchor = Array.from(anchors).find(anchor => anchor.getAttribute('href') === `#${id}`);
            if (correspondingAnchor) {
                anchors.forEach(anchor => anchor.classList.remove('active'));
                correspondingAnchor.classList.add('active');
            }
        }
    }, {
        threshold: 0.3,
        rootMargin: '-20% 0px -20% 0px'
    });

    sections.forEach(section => observer.observe(section));

    anchors.forEach(anchor => {
        anchor.addEventListener('click', (event) => {
            anchors.forEach(a => a.classList.remove('active'));
            event.target.classList.add('active');
        });
    });
    applyAnalyticHeaderOverride(block);
}
