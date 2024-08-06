import { createTag, removeEmptyPTags } from '../../scripts/lib-adobeio.js';
/**
 * decorates the calendar
 * @param {Element} block The calendar block element
 */
export default async function decorate(block) {
  block.setAttribute('daa-lh', 'calendar');
  removeEmptyPTags(block);

  const calendar_iframe = createTag('iframe', {class: 'iframe-container'});

  block.querySelectorAll('a').forEach((a) => {
    const link = a.href;
    a.parentElement.replaceWith(calendar_iframe);
    calendar_iframe.src = link;
    calendar_iframe.parentElement.classList.add('calendar-block');

  });
}