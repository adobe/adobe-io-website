export default function createDivider({ size, style, orientation = 'horizontal' }) {
  const hr = document.createElement('hr');
  hr.setAttribute('role', 'separator');
  hr.setAttribute('aria-orientation', orientation);

  Object.entries(style).forEach(([key, value]) => {
    hr.style.setProperty(key, value);
  });

  hr.classList.add('spectrum-Divider', `spectrum-Divider--size${size}`);
  if (orientation === 'vertical') {
    hr.classList.add('spectrum-Divider--vertical');
  }
  return hr;
}
