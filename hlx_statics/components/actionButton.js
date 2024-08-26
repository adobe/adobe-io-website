import { createTag } from "../scripts/lib-adobeio.js";

export function decorateActionButton(
  {
    actionButton,
    size = "M",
    isDisable = false,
    isQuiet = false,
    staticWhite = false,
    staticBlack = false
  }
) {
  // size possible values are --> XS , S , M , L(default) , XL
  actionButton.classList.add(
    "spectrum-ActionButton",
    `spectrum-ActionButton--size${size.toUpperCase()}`,
    `${isQuiet && "spectrum-ActionButton--quiet"}`,
    `${staticWhite && "spectrum-ActionButton--staticWhite"}`,
    `${staticBlack && "spectrum-ActionButton--staticBlack"}`
  )
  if (isDisable)
    actionButton.setAttribute("disabled")
  const innerSpan = actionButton.querySelector('span');
  innerSpan.classList.add("spectrum-ActionButton-label");
}

export function createButton({ text = "", id = "btn", classname = "" }) {
  const button = createTag('button', { class: classname, id });
  const span = createTag('span');
  span.innerHTML = text;
  button.appendChild(span);
  return button;
}
