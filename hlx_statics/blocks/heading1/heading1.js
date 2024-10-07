import decorateHeading from '../../components/heading.js';

export default function decorate(block) {
  const heading1Wrapper = document.querySelector('.heading1-wrapper');
  const nextWrapper = heading1Wrapper.nextElementSibling;
  const p = nextWrapper.querySelector('p');
  p.classList.add('header-content');
  decorateHeading({ level: 1, block });
}
