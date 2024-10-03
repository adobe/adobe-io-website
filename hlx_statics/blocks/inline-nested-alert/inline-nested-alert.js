import { createTag } from '../../scripts/lib-adobeio.js';

function getVariant(variant) {
    const icons = {
        info: `<svg aria-hidden='true' focusable='false' class='spectrum-Icon info-icon info-NestedAlertIcon nested-svg'><use href='/hlx_statics/icons/info.svg#icon-info'></use></svg>`,
        help: `<svg aria-hidden='true' focusable='false' class='spectrum-Icon help-icon help-NestedAlertIcon nested-svg'><use href='/hlx_statics/icons/help-icon.svg#icon-help'></use></svg>`,
        success: `<svg aria-hidden='true' focusable='false' class='spectrum-Icon success-icon success-NestedAlertIcon nested-svg'><use href='/hlx_statics/icons/success-icon.svg#icon-success'></use></svg>`,
        error: `<svg aria-hidden='true' focusable='false' class='spectrum-Icon error-icon alert-NestedAlertIcon nested-svg'><use href='/hlx_statics/icons/warning-icon.svg#icon-alert'></use></svg>`,
        warning: `<svg aria-hidden='true' focusable='false' class='spectrum-Icon warning-icon alert-NestedAlertIcon nested-svg'><use href='/hlx_statics/icons/warning-icon.svg#icon-alert'></use></svg>`,
    };
    return { icon: icons[variant] || '' };
}

/**
 * Loads and decorates the columns
 * @param {Element} block The inline-nested-alert block element
 */
export default async function decorate(block) {
    const parent = block?.parentElement?.parentElement;

    const variant = parent?.getAttribute('data-variant');
    const iconPosition = parent?.getAttribute('data-iconposition');
    const isNested = parent?.getAttribute('data-isnested');
    const isLinkDecorate = parent?.getAttribute('data-islinkdecorate');
    const header = parent?.getAttribute('data-header');

    parent.style.padding = header === 'true' ? '0px' : '10px 0px';
    const anchorTags = block.querySelectorAll('.inline-nested-alert a');
    anchorTags.forEach(anchor => {
        anchor.setAttribute('rel', 'noopener noreferrer');
        anchor.setAttribute('target', '_self');
        anchor.setAttribute('aria-label', 'Visit external site XYZ');
    });

    const inlineNestedAlerts = block.querySelectorAll('.inline-nested-alert > div');
    inlineNestedAlerts.forEach((inlineNestedAlert) => {
        inlineNestedAlert.classList.add(header === 'true' ? 'InLineNestedAlert-Header' : 'InLineNestedAlert');
        if (variant) {
            inlineNestedAlert.classList.add(`InLineNestedAlert-${variant}`);
            inlineNestedAlert.insertAdjacentHTML('afterbegin', getVariant(variant).icon);
        }

        const svgElement = inlineNestedAlert.querySelector('.InLineNestedAlert .nested-svg');
        if (svgElement) {
            const iconWrapper = createTag('div', { class: 'nestedSvgIcon-wrapper' });
            svgElement.parentNode.insertBefore(iconWrapper, svgElement);
            iconWrapper.appendChild(svgElement);
        }

        if (isNested === 'true') {
            Object.assign(inlineNestedAlert.style, {
                marginLeft: '40px',
                maxWidth: '720px'
            });
        }

        Object.assign(inlineNestedAlert.style, {
            display: 'flex',
            flexDirection: iconPosition === 'right' ? 'row-reverse' : 'row',
            gap: '20px'
        });
    });

    block.querySelectorAll('h1, h2, h3, h4, h5, h6').forEach((h) => h.style.margin = '0px');

    if (isLinkDecorate === 'true') {
        block.querySelectorAll('a').forEach((a) => {
            Object.assign(a.style, {
                border: '1px solid rgb(213, 207, 207)',
                backgroundColor: 'rgb(243, 242, 242)',
                padding: '2px 4px',
                borderRadius: '3px',
                color: 'rgb(0,84,182)'
            });
        });
    }
}
