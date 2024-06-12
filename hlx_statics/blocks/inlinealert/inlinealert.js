import {
    createTag,
    getBlockSectionContainer
  } from '../../scripts/lib-adobeio.js';


function InfoMedium() {
    return `
        <svg
            class="spectrum-Icon spectrum-UIIcon-InfoMedium spectrum-InLineAlert-icon"
            style="width: var(--spectrum-icon-info-medium-width, var(--spectrum-global-dimension-size-225)); height: var(--spectrum-icon-info-medium-height, var(--spectrum-global-dimension-size-225));"
            <path
                d="M11 2a9 9 0 109 9 9 9 0 00-9-9zm-.15 2.65a1.359 1.359 0 011.431 1.283q.004.064.001.129a1.332 1.332 0 01-1.432 1.432 1.353 1.353 0 01-1.432-1.433 1.359 1.359 0 011.304-1.412q.064-.002.128.001zM13.5 16a.5.5 0 01-.5.5H9a.5.5 0 01-.5-.5v-1a.5.5 0 01.5-.5h1v-4H9a.5.5 0 01-.5-.5V9a.5.5 0 01.5-.5h2.5a.5.5 0 01.5.5v5.5h1a.5.5 0 01.5.5z"
                class="spectrum-UIIcon--large"></path>
            <path
                d="M9 1a8 8 0 108 8 8 8 0 00-8-8zm-.15 2.15a1.359 1.359 0 011.431 1.283q.004.064.001.129A1.332 1.332 0 018.85 5.994a1.353 1.353 0 01-1.432-1.433 1.359 1.359 0 011.304-1.412q.064-.002.128.001zM11 13.5a.5.5 0 01-.5.5h-3a.5.5 0 01-.5-.5v-1a.5.5 0 01.5-.5H8V9h-.5a.5.5 0 01-.5-.5v-1a.5.5 0 01.5-.5h2a.5.5 0 01.5.5V12h.5a.5.5 0 01.5.5z"
                class="spectrum-UIIcon--medium"></path>
        </svg>`
}
  
function SuccessMedium() {
    return `
        <svg
            class="spectrum-Icon spectrum-UIIcon-SuccessMedium spectrum-InLineAlert-icon"
            style="width: var(--spectrum-icon-success-medium-width, var(--spectrum-global-dimension-size-225)); height: var(--spectrum-icon-success-medium-height, var(--spectrum-global-dimension-size-225);"
            <path
                d="M11 2a9 9 0 109 9 9 9 0 00-9-9zm5.638 5.609L10.1 15.652a.5.5 0 01-.742.038L5.086 11.5a.5.5 0 010-.707l.707-.707a.5.5 0 01.707 0L9.6 13.1l5.486-6.751a.5.5 0 01.7-.073l.776.631a.5.5 0 01.076.702z"
                class="spectrum-UIIcon--large"></path>
            <path
                d="M9 1a8 8 0 108 8 8 8 0 00-8-8zm5.333 4.54l-6.324 8.13a.6.6 0 01-.437.23h-.037a.6.6 0 01-.425-.176l-3.893-3.9a.6.6 0 010-.849l.663-.663a.6.6 0 01.848 0L7.4 10.991l5.256-6.754a.6.6 0 01.843-.1l.728.566a.6.6 0 01.106.837z"
                class="spectrum-UIIcon--medium"></path>
        </svg>`
}

function NeutralMedium() {
    // no image 
    return `
        <svg class="spectrum-Icon"></svg>`
}

function HelpMedium() {
    return `
        <svg
        class="spectrum-Icon spectrum-UIIcon-HelpMedium spectrum-InLineAlert-icon"
        style="width: var(--spectrum-icon-help-medium-width, var(--spectrum-global-dimension-size-225)); height: var(--spectrum-icon-help-medium-height, var(--spectrum-global-dimension-size-225));"
        <path
            d="M11 2a9 9 0 109 9 9 9 0 00-9-9zm-.007 14.681a1.145 1.145 0 01-1.227-1.215 1.159 1.159 0 011.115-1.201q.056-.002.112.001a1.159 1.159 0 011.226 1.088q.003.056.001.112a1.127 1.127 0 01-1.227 1.215zm1.981-6.63c-.684.642-1.344 1.215-1.333 1.736a2.275 2.275 0 00.176.732.25.25 0 01-.232.343h-1.26a.3.3 0 01-.228-.069 1.886 1.886 0 01-.421-1.2c0-.816.508-1.336 1.35-2.17.578-.573.911-.937.911-1.475 0-.625-.421-1.059-1.49-1.059a5.337 5.337 0 00-2 .473.249.249 0 01-.347-.23v-1.24a.5.5 0 01.3-.459 6.413 6.413 0 012.434-.5c2.1.006 3.261 1.2 3.261 2.725a3.053 3.053 0 01-1.121 2.393z"
            class="spectrum-UIIcon--large"></path>
        <path
            d="M9 1a8 8 0 108 8 8 8 0 00-8-8zm1.3 12.3a1.222 1.222 0 01-.3.9 1.223 1.223 0 01-.9.3 1.2 1.2 0 010-2.4c.8 0 1.3.5 1.2 1.2zm.1-4.5c-.4.4-.8.8-.8 1.2a1.135 1.135 0 00.3.8v.1a.098.098 0 01-.096.1H8.4a.229.229 0 01-.2-.1 1.666 1.666 0 01-.4-1.1 2.772 2.772 0 011-1.7 2.772 2.772 0 001-1.7c0-.5-.4-1.1-1.4-1.1a5.018 5.018 0 00-2 .4h-.2V4.3c0-.1 0-.2.1-.2a6.183 6.183 0 012.4-.5c1.9 0 3.1 1.1 3.1 2.7a3.704 3.704 0 01-1.4 2.5z"
            class="spectrum-UIIcon--medium"></path>
        </svg>`
}

function AlertMedium() {
    return `
    <svg
      class="spectrum-Icon spectrum-UIIcon-AlertMedium spectrum-InLineAlert-icon"
      style="width: var(--spectrum-icon-alert-medium-width, var(--spectrum-global-dimension-size-225)); height: var(--spectrum-icon-alert-medium-height, var(--spectrum-global-dimension-size-225));"
      <path
        d="M10.563 2.206l-9.249 16.55a.5.5 0 00.436.744h18.5a.5.5 0 00.436-.744l-9.251-16.55a.5.5 0 00-.872 0zm1.436 15.044a.25.25 0 01-.25.25h-1.5a.25.25 0 01-.25-.25v-1.5a.25.25 0 01.25-.25h1.5a.25.25 0 01.25.25zm0-3.5a.25.25 0 01-.25.25h-1.5a.25.25 0 01-.25-.25v-6a.25.25 0 01.25-.25h1.5a.25.25 0 01.25.25z"
        class="spectrum-UIIcon--large"></path>
      <path
        d="M8.564 1.289L.2 16.256A.5.5 0 00.636 17h16.728a.5.5 0 00.436-.744L9.436 1.289a.5.5 0 00-.872 0zM10 14.75a.25.25 0 01-.25.25h-1.5a.25.25 0 01-.25-.25v-1.5a.25.25 0 01.25-.25h1.5a.25.25 0 01.25.25zm0-3a.25.25 0 01-.25.25h-1.5a.25.25 0 01-.25-.25v-6a.25.25 0 01.25-.25h1.5a.25.25 0 01.25.25z"
        class="spectrum-UIIcon--medium"></path>
    </svg>`
}

function getClassVariant(classList) {
    // variants: neutral, info, help, success, warning, error
    let classVariant = '';

    if(classList.contains('info')){
        classVariant = 'spectrum-InLineAlert--info';
    }
    if(classList.contains('help')){
        classVariant = 'spectrum-InLineAlert--help';
    }
    if(classList.contains('success')){
        classVariant = 'spectrum-InLineAlert--success';
    }
    if(classList.contains('warning')){
        classVariant = 'spectrum-InLineAlert--warning';
    }
    if(classList.contains('error')){
        classVariant = 'spectrum-InLineAlert--error';
    }
    return classVariant;
}

function getIconVariant(classList) {
    // variants: neutral, info, help, success, warning, error
    let iconVariant = '';

    if(classList.contains('neutral')){
        iconVariant = NeutralMedium();
    }
    if(classList.contains('info')){
        iconVariant = InfoMedium();
    }
    if(classList.contains('help')){
        iconVariant = HelpMedium();
    }
    if(classList.contains('success')){
        iconVariant = SuccessMedium();
    }
    if(classList.contains('warning')){
        iconVariant = AlertMedium();
    }
    if(classList.contains('error')){
        iconVariant = AlertMedium();
    }
    return iconVariant;    
}

  /**
 * loads and decorates the columns
 * @param {Element} block The columns block element
 */
export default async function decorate(block) {
    const container = getBlockSectionContainer(block);

    block.querySelectorAll('.inlinealert > div').forEach((inlineAlert) => {
        inlineAlert.classList.add('spectrum-InLineAlert');
        let classVariant = getClassVariant(block.classList);
        if(classVariant) inlineAlert.classList.add(classVariant);
        inlineAlert.insertAdjacentHTML("afterbegin", getIconVariant(block.classList));

        // need to wrap content into p
        inlineAlert.querySelectorAll('div').forEach((divContent) =>{
            const inlineP = createTag('p', { class: 'spectrum-InLineAlert-content' });
            inlineP.innerHTML = divContent.innerHTML;
            inlineAlert.appendChild(inlineP);
            divContent.replaceWith(inlineP);
        });
        // need to find example with header
        // inlineAlert.querySelectorAll('h1').forEach((header) =>{
        //     const divHeader = createTag('div', { class: 'spectrum-InLineAlert-header' });
        //     const parent = header.parentElement;
        //     divHeader.innerHTML = header.innerHTML;
        //     parent.appendChild(divHeader);

        //     header.replaceWith(divHeader);
        // });
    })

}
  
// <div class="spectrum-InLineAlert spectrum-InLineAlert--info">
//   <div class="spectrum-InLineAlert-header">
//     Information in-line alert header
//     <svg class="spectrum-Icon spectrum-Icon--sizeM spectrum-InLineAlert-icon" focusable="false" aria-hidden="true">
//       <use xlink:href="#spectrum-icon-18-Info" />
//     </svg>
//   </div>
//   <div class="spectrum-InLineAlert-content">This is an alert.</div>
// </div>