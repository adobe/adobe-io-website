import { applyBkgColorOverride, decorateButtons, applyWidthOverride } from "../../scripts/lib-adobeio.js";

function rearrangeLinks(block) {
  const leftDiv = block.firstElementChild.firstElementChild;
  const dcSummaryButtonContainer = document.createElement("div");
  dcSummaryButtonContainer.classList.add("dcSummary-button-container");
  leftDiv.querySelectorAll("p.button-container").forEach((p) => {
    dcSummaryButtonContainer.append(p);
  });
  leftDiv.append(dcSummaryButtonContainer);
}

/**
 * decorates the dcsummary
 * @param {Element} block The dcsummary block element
 */
export default async function decorate(block) {
  const fontcolor = block?.parentElement?.parentElement?.getAttribute("data-fontcolor");
  block.setAttribute("daa-lh", "title");
  block.querySelectorAll("h1, h2, h3, h4, h5, h6").forEach((h) => {
    h.classList.add("spectrum-Heading", "spectrum-Heading--sizeL", "title-heading");
    h.style.color = fontcolor ? fontcolor : "white";
  });
  block.querySelectorAll("p").forEach((p) => {
    if (p.innerText) {
      p.classList.add("spectrum-Body", "spectrum-Body--sizeL");
    }
  });
  decorateButtons(block);
  rearrangeLinks(block);
  applyBkgColorOverride(block);
  applyWidthOverride(block);
}
