import {
    createTag,
    getBlockSectionContainer
  } from '../../scripts/lib-adobeio.js';

function NeutralMedium() {
    // no image 
    return `
        <svg class="spectrum-Icon"></svg>`
}

function getVariant(classList) {
    // variants: neutral, info, help, success, warning, error
    let classVariant = {
        class: '',
        icon: ''
    };

    if(classList.contains('neutral')){
        classVariant.icon = NeutralMedium();
    }
    if(classList.contains('info')){
        classVariant.class = 'spectrum-InLineAlert--info';
        classVariant.icon = `<svg class="spectrum-Icon spectrum-UIIcon-InfoMedium spectrum-InLineAlert-icon" focusable="false" aria-hidden="true" style="width: 22px; height: 22px;"><use href="/hlx_statics/icons/info.svg#icon-info"></use></svg>`;
    }
    if(classList.contains('help')){
        classVariant.class = 'spectrum-InLineAlert--help';
        classVariant.icon = `<svg class="spectrum-Icon spectrum-UIIcon-HelpMedium spectrum-InLineAlert-icon" style="width: 22px; height: 22px;"><use href="/hlx_statics/icons/help-icon.svg#icon-help"></use></svg>`;
    }
    if(classList.contains('success')){
        classVariant.class = 'spectrum-InLineAlert--success';
        classVariant.icon =  `<svg class="spectrum-Icon spectrum-UIIcon-SuccessMedium spectrum-InLineAlert-icon" style="width: 22px; height: 22px;"><use href="/hlx_statics/icons/success-icon.svg#icon-success"></use></svg>`;
    }
    if(classList.contains('warning')){
        classVariant.class = 'spectrum-InLineAlert--warning';
        classVariant.icon = `<svg class="spectrum-Icon spectrum-UIIcon-AlertMedium spectrum-InLineAlert-icon" style="width: 22px; height: 22px;"><use href="/hlx_statics/icons/warning-icon.svg#icon-alert"></use></svg>`;
    }
    if(classList.contains('error')){
        classVariant.class = 'spectrum-InLineAlert--error';
        classVariant.icon =`<svg class="spectrum-Icon spectrum-UIIcon-AlertMedium spectrum-InLineAlert-icon" style="width: 22px; height: 22px;"><use href="/hlx_statics/icons/warning-icon.svg#icon-alert"></use></svg>`;
    }
    return classVariant;
}

  /**
 * loads and decorates the columns
 * @param {Element} block The columns block element
 */
export default async function decorate(block) {
    const container = getBlockSectionContainer(block);

    block.querySelectorAll('.inlinealert > div').forEach((inlineAlert) => {
        inlineAlert.classList.add('spectrum-InLineAlert'); 
        // figure out variant based on parent element or on the block itself
        // TODO: may need to refactor this logic
        let classVariant = getVariant(block.parentElement.parentElement.classList) ;
        if(classVariant) {
            inlineAlert.classList.add(classVariant.class);
            inlineAlert.insertAdjacentHTML("afterbegin", classVariant.icon);
        }

        // need to wrap content into p
        inlineAlert.querySelectorAll('div').forEach((divContent) =>{
            const inlineP = createTag('p', { class: 'spectrum-InLineAlert-content' });
            inlineP.innerHTML = divContent.innerHTML;
            inlineAlert.appendChild(inlineP);
            divContent.replaceWith(inlineP);
        });
    })
}
