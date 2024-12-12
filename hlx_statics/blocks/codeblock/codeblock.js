import { toClassName } from '../../scripts/lib-helix.js';
import decoratePreformattedCode from '../../components/code.js';

// Function to create a button element for tabs
function createTabButton(tab, id, isSelected, onClick) {
  const button = document.createElement('button');
  button.className = 'tabs-tab';
  button.id = `tab-${id}`;
  button.innerHTML = tab.innerHTML;
  button.setAttribute('aria-controls', `tabpanel-${id}`);
  button.setAttribute('aria-selected', isSelected);
  button.setAttribute('role', 'tab');
  button.setAttribute('type', 'button');
  button.addEventListener('click', onClick);
  return button;
}

// Function to initialize tabs and their associated panels
function decorateTabs(block) {
  const tablist = document.createElement('div');
  tablist.className = 'tabs-list';
  tablist.setAttribute('role', 'tablist');

  const tabs = [...block.children].map(child => child.firstElementChild);

  tabs.forEach((tab, i) => {
    const id = toClassName(tab.textContent);
    const tabpanel = block.children[i];

    // Set up tabpanel attributes
    tabpanel.className = 'tabs-panel';
    tabpanel.id = `tabpanel-${id}`;
    tabpanel.setAttribute('aria-hidden', i !== 0);
    tabpanel.setAttribute('aria-labelledby', `tab-${id}`);
    tabpanel.setAttribute('role', 'tabpanel');

    // Create and append the tab button
    const button = createTabButton(tab, id, i === 0, () => {
      // Hide all tab panels and reset buttons
      block.querySelectorAll('[role=tabpanel]').forEach(panel => {
        panel.setAttribute('aria-hidden', true);
      });
      tablist.querySelectorAll('button').forEach(btn => {
        btn.setAttribute('aria-selected', false);
      });
      // Show the selected tab panel and update the button state
      tabpanel.setAttribute('aria-hidden', false);
      button.setAttribute('aria-selected', true);
    });

    tablist.append(button);
    tab.remove();
  });

  block.prepend(tablist);
}

// Main function to decorate the block and its code
export default function decorate(block) {
  decorateTabs(block);

  block.querySelectorAll('[role=tabpanel]').forEach(panel => {
    decoratePreformattedCode(panel);
  });
}
