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

{/* <iframe src="https://calendar.google.com/calendar/embed?src=dianeba3%40gmail.com&ctz=America%2FNew_York" style="border: 0" width="800" height="600" frameborder="0" scrolling="no"></iframe> */}
