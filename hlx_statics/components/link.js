export default function decorateLink({ link, variant = 'primary' }) {
  link.classList.add('spectrum-Link', 'spectrum-Link--quiet');
  if (variant === 'secondary') {
    link.classList.add('spectrum-Link--secondary');
  }
}
