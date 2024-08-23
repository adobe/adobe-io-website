import { applyBkgColorOverride } from "../../scripts/lib-adobeio.js";
import { toClassName } from "../../scripts/lib-helix.js";

/**
 * decorates the text
 * @param {*} block The text block element
 */

export default async function decorate(block) {
  block.setAttribute('daa-lh', 'tab');
  applyBkgColorOverride(block);
  let fontcolor = block?.parentElement?.parentElement?.getAttribute('data-fontcolor');
  fontcolor = fontcolor ? fontcolor : "rgb(209, 209, 209)";
  const orientation = block?.parentElement?.parentElement?.getAttribute('data-orientation');
  const backgroundColor = block?.parentElement?.parentElement?.getAttribute('data-backgroundcolor');
  block.classList.add(`${orientation}-tab`);
  let codeBackgroundColor = block?.parentElement?.parentElement?.getAttribute('data-codebackgroundcolor');
  codeBackgroundColor = codeBackgroundColor ? codeBackgroundColor : "rgb(0,0,0)"

  block.querySelectorAll('p').forEach((p) => {
    p.classList.add('spectrum-Body', 'spectrum-Body--sizeL');
    p.style.color = fontcolor;
  });

  const innerTab = document.createElement('div');

  if (backgroundColor === "navy") {
    innerTab.classList.add('navy');
  }

  innerTab.classList.add('innerTab');

  Array.from(block.children).forEach((div, index) => {
    if (index > 0) {
      div.setAttribute('id', `tabView${index - 1}`);

      const table = block.querySelector('table');

      if (table) {
        const tabContainer = document.createElement('div');
        tabContainer.classList.add('custom-tab-container');
        tabContainer.style.backgroundColor = codeBackgroundColor;

        const tabHeaders = document.createElement('div');
        tabHeaders.classList.add('custom-tab-headers');

        const heading = document.createElement('div');
        heading.classList.add('custom-tab-heading');
        heading.style.backgroundColor = codeBackgroundColor;

        const tabContents = document.createElement('div');
        tabContents.classList.add('custom-tab-contents');

        const rows = Array.from(table.querySelectorAll('tr'));
        const headers = rows[0].children;
        const contents = rows[1].children;

        Array.from(headers).forEach((header, index) => {
          const tabHeader = document.createElement('div');
          tabHeader.classList.add('custom-tab-header');
          tabHeader.textContent = header.textContent;

          if (index === 0) {
            tabHeader.classList.add('active-tab');
          }

          const tabContent = document.createElement('div');
          tabContent.classList.add('custom-tab-content');

          const codeContentContainer = document.createElement('pre');
          codeContentContainer.classList.add('code-content');
          codeContentContainer.style.backgroundColor = codeBackgroundColor;

          const code = contents[index].querySelector('code');
          const i = code.innerHTML.indexOf('\n');
          const language = code.innerHTML.substring(0, i);
          const codeTag = document.createElement('code');
          codeTag.innerHTML = code.innerHTML.substring(i + 1, code.innerHTML.length);

          codeContentContainer.classList.add('line-numbers');
          codeTag.classList.add(`language-${toClassName(language)}`);
          codeTag.setAttribute('data-prismjs-copy', 'Copy');
          codeTag.setAttribute('data-prismjs-copy-success', 'Copied to your clipboard');
          codeTag.setAttribute('data-prismjs-copy-timeout', '3000');
          codeContentContainer.appendChild(codeTag);
          tabContent.appendChild(codeContentContainer)

          if (index !== 0) {
            tabContent.style.display = 'none';
          }

          tabHeader.addEventListener('click', () => {
            tabContainer.querySelector('.active-tab').classList.remove('active-tab');
            tabContainer.querySelector('.custom-tab-content:not([style*="display: none"])').style.display = 'none';

            tabHeader.classList.add('active-tab');
            tabContent.style.display = 'block';
          });

          heading.appendChild(tabHeader);
          tabContents.appendChild(tabContent);
        });

        tabHeaders.appendChild(heading);
        tabContainer.appendChild(tabHeaders);
        tabContainer.appendChild(tabContents);
        table.replaceWith(tabContainer);

      }

    }
    innerTab.append(div);
  })

  block.append(innerTab);
  block.firstElementChild.firstElementChild.firstElementChild.classList.add('activeTab', `${backgroundColor}Tab`);
  block.querySelectorAll('#tabView0')[0].classList.add('activeTabContent');
  Array.from(block.firstElementChild.firstElementChild.children).forEach((div, index) => {
    div.setAttribute('aria-controls', `tabView${index}`);
    div.addEventListener("click", () => {
      block.querySelectorAll('.activeTab')[0].classList.remove('activeTab', `${backgroundColor}Tab`);
      div.classList.add('activeTab');
      block.querySelectorAll('.activeTabContent')[0].classList.remove('activeTabContent');
      block.querySelectorAll(`#${div.getAttribute('aria-controls')}`)[0].classList.add('activeTabContent');
    })
  })
}