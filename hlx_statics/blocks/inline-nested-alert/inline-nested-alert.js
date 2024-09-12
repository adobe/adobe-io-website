import { createTag } from "../../scripts/lib-adobeio.js";

function getVariant(variant) {
    let classVariant = { icon: '' };
    if (variant === "info") {
        classVariant.icon = `<svg aria-hidden="true" focusable="false" class="spectrum-Icon info-icon info-NestedAlertIcon"><use href="/hlx_statics/icons/info.svg#icon-info"></use></svg>`;
    }
    if (variant === "help") {
        classVariant.icon = `<svg aria-hidden="true" focusable="false" class="spectrum-Icon help-icon help-NestedAlertIcon"><use href="/hlx_statics/icons/help-icon.svg#icon-help"></use></svg>`;
    }
    if (variant === "success") {
        classVariant.icon = `<svg aria-hidden="true" focusable="false" class="spectrum-Icon success-icon success-NestedAlertIcon"><use href="/hlx_statics/icons/success-icon.svg#icon-success"></use></svg>`;
    }
    if (variant === "error") {
        classVariant.icon = `<svg aria-hidden="true" focusable="false" class="spectrum-Icon error-icon alert-NestedAlertIcon"><use href="/hlx_statics/icons/warning-icon.svg#icon-alert"></use></svg>`;
    }
    if (variant === "warning") {
        classVariant.icon = `<svg aria-hidden="true" focusable="false" class="spectrum-Icon warning-icon alert-NestedAlertIcon"><use href="/hlx_statics/icons/warning-icon.svg#icon-alert"></use></svg>`;
    }
    return classVariant;
}
/**
* loads and decorates the columns
* @param {Element} block The inline-nested-alert block element
*/
export default async function decorate(block) {
    const variant = block?.parentElement?.parentElement?.getAttribute('data-variant');
    const iconPosition = block?.parentElement?.parentElement?.getAttribute('data-iconposition');
    const isNested = block?.parentElement?.parentElement?.getAttribute('data-isnested');
    const isLinkDecorate = block?.parentElement?.parentElement?.getAttribute('data-islinkdecorate');
    const header = block?.parentElement?.parentElement?.getAttribute('data-header');


    block.parentElement.parentElement.style.padding = "10px 0px";
    block.querySelectorAll('.inline-nested-alert > div').forEach((inlineNestedAlert) => {
        if (header === "true") {
            inlineNestedAlert.classList.add('InLineNestedAlert-Header');
            block.parentElement.parentElement.style.padding = "0px";
        } else {
            inlineNestedAlert.classList.add('InLineNestedAlert');
        }
        if (variant) {
            inlineNestedAlert.classList.add(`InLineNestedAlert-${variant}`);
        }
        let classVariant = getVariant(variant);
        if (classVariant) {
            inlineNestedAlert.insertAdjacentHTML("afterbegin", classVariant.icon);
        }
        const svgElement = inlineNestedAlert.querySelector('.InLineNestedAlert .nested-svg');
        if (svgElement) {
            const iconWrapper = createTag('div', { class: 'nestedSvgIcon-wrapper' });
            svgElement.parentNode.insertBefore(iconWrapper, svgElement);
            iconWrapper.appendChild(svgElement);
        }
        if (isNested === "true") {
            Object.assign(inlineNestedAlert.style, {
                marginLeft: "40px",
                width: "720px",
            });
        }
        if (iconPosition === "right") {
            Object.assign(inlineNestedAlert.style, {
                display: "flex",
                flexDirection: "row-reverse",
                gap: "20px"
            });
        } else {
            Object.assign(inlineNestedAlert.style, {
                display: "flex",
                flexDirection: "row",
                gap: "20px"
            });
        }
    })
    block.querySelectorAll('h1, h2, h3, h4, h5, h6').forEach((h) => {
        h.style.margin = "0px"
    })
    if (isLinkDecorate === 'true') {
        block.querySelectorAll('a').forEach((a) => {
            Object.assign(a.style, {
                border: "1px solid rgb(213 207 207)",
                backgroundColor: "rgb(243 242 242)",
                padding: "2px 4px",
                borderRadius: "3px",
                color: "rgb(0,84,182)"
            });
        })
    }
}