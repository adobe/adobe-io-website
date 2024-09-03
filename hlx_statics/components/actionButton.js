import { createTag } from "../scripts/lib-adobeio.js";

export function decorateActionButton({
  actionButton,
  size = "M",
  isDisable = false,
  isQuiet = false,
  staticWhite = false,
  staticBlack = false,
  icon
}) {
  const normalizeButton = actionButton.tagName === "BUTTON" ? actionButton : actionButton.querySelector('a');

  if (normalizeButton) {
    normalizeButton.classList.add(
      "spectrum-ActionButton",
      `spectrum-ActionButton--size${size.toUpperCase()}`,
      isQuiet && "spectrum-ActionButton--quiet",
      staticWhite && "spectrum-ActionButton--staticWhite",
      staticBlack && "spectrum-ActionButton--staticBlack",
    );
    normalizeButton.style.gap = icon && "5px";
    normalizeButton.style.flexDirection = icon && "row-reverse";

    if (isDisable) {
      normalizeButton.setAttribute("disabled");
    }

    if (!normalizeButton.querySelector('span')) {
      normalizeButton.innerHTML = "";
      const createSpan = document.createElement('span');
      createSpan.innerHTML = normalizeButton.title || "";
      normalizeButton.appendChild(createSpan);
    }

    // if (icon) {
    //   const iconContainer = document.createElement('span');
    //   iconContainer.style.display = "flex";
    //   iconContainer.innerHTML = `<svg class="spectrum-Icon spectrum-Icon--size${size.toUpperCase()}" focusable="false" aria-hidden="true" aria-label="Edit">
    //                                   <use href="/hlx_statics/icons/search.svg#spectrum-icon-24-Search"></use>
    //                              </svg>`
    //   normalizeButton.appendChild(iconContainer);
    // }

    normalizeButton.querySelector('span').classList.add("spectrum-ActionButton-label");
  }
}

export function createButton({ text = "", id = "btn", classname = "" }) {
  const button = createTag('button', { class: classname, id });
  const span = createTag('span');
  span.innerHTML = text;
  button.appendChild(span);
  return button;
}
