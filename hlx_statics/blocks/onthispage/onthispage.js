/**
 * decorates the onthispage
 * @param {Element} block The onthispage block element {Parameter Type} Name of the Parameter
 */
export default async function decorate(block) {
    const section = document.querySelector('main > div:not(.side-nav-container):not(.footer-wrapper)');
    section.style.display = "block";
    const onThisPageWrapper = document.querySelector('.onthispage-wrapper');
    const parentContainer = document.createElement('div');
    parentContainer.classList.add('parent-container');
    section.parentNode.insertBefore(parentContainer, section);
    parentContainer.appendChild(section);
    parentContainer.appendChild(onThisPageWrapper);

    const anchors = document.querySelectorAll('.onthispage-wrapper a');
    anchors.forEach((anchor, index) => {
        if (index === 0) {
            anchor.classList.add('active');
        }
    });

    const sections = Array.from(document.querySelectorAll('main h1[id], main h2[id], main h3[id], main h4[id], main h5[id], main h6[id]'));
    const observer = new IntersectionObserver((entries) => {
        let maxVisibleSection = null;
        let maxVisibleHeight = 0;

        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const { target } = entry;
                const rect = target.getBoundingClientRect();
                const visibleHeight = Math.min(rect.bottom, window.innerHeight) - Math.max(rect.top, 0);

                if (visibleHeight > maxVisibleHeight) {
                    maxVisibleHeight = visibleHeight;
                    maxVisibleSection = target;
                }
            }
        });

        if (maxVisibleSection) {
            const id = maxVisibleSection.getAttribute('id');
            const correspondingAnchor = Array.from(anchors).find(anchor => anchor.getAttribute('href') === `#${id}`);

            if (correspondingAnchor) {
                anchors.forEach(anchor => anchor.classList.remove('active'));
                correspondingAnchor.classList.add('active');
            }
        }
    }, {
        threshold: [0.3],
        rootMargin: '-20% 0px -20% 0px'
    });

    sections.forEach(section => observer.observe(section));

    const handleAnchorClick = (event) => {
        anchors.forEach(anchor => anchor.classList.remove('active'));
        event.target.classList.add('active');
    };

    anchors.forEach(anchor => {
        anchor.addEventListener('click', handleAnchorClick);
    });
}