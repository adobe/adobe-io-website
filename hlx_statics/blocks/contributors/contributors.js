import { getMetadata, getContributorsJsonPath } from '../../scripts/lib-helix.js';
import insertWrapperContainer from '../../components/wrapperContainer.js';

async function fetchContributorsData() {
  try {
    const pathPrefix = getMetadata('pathprefix');
    const pagePath = window.location.pathname;
    if (!pathPrefix || !pagePath || !pagePath.startsWith(pathPrefix)) {
      return null;
    }
    
    const jsonPath = await getContributorsJsonPath();
    if (!jsonPath) return null;

    const response = await fetch(jsonPath);
    if (!response.ok) {
      console.warn('Network response was not ok:', jsonPath);
      return null;
    }

    const json = await response.json();
    const page = pagePath.slice(pathPrefix.length);
    return json?.data?.find(item => item.page === page) ?? null;

  } catch (e) {
    console.error('Contributors fetch error:', e);
    return null;
  }
}

/**
 * Decorates the contributors block
 * @param {Element} block The contributors block element
 */
export default async function decorate(block) {

  insertWrapperContainer(block);

  const modalHTML = `
    <div class="contributor-modal">
      <div class="spectrum-Underlay spectrum-overlay is-open" aria-hidden="true"></div>
      <div class="model-comp-contributors">
        <div class="spectrum-Modal is-open show-model-contributors">
          <section class="spectrum-Dialog spectrum-Dialog--medium spectrum-Dialog--confirmation" role="alertdialog" aria-modal="true">
            <div class="wrapper-model">
              <h1 class="spectrum-Dialog-heading">Thank you for your feedback</h1>
              <hr />
              <p class="spectrum-Body">Thank you for helping improve Adobe's documentation.</p>
              <section class="spectrum-Dialog-content">
                <div class="content-wrapper-contributors">
                  <div class="button-wrapper-contributor">
                    <button class="spectrum-Button spectrum-Button--fill spectrum-Button--accent spectrum-Button--sizeM close-button">
                      <span class="spectrum-Button-label">Close</span>
                    </button>
                  </div>
                </div>
              </section>
            </div>
          </section>
        </div>
      </div>
    </div>
  `;

  const modal = document.createElement('div');
  modal.innerHTML = modalHTML;
  document.body.appendChild(modal);

  const data = await fetchContributorsData();
  const avatars = data?.avatars ?? [];
  const lastUpdated = data?.lastUpdated ?? '';

  const blobUrl = getMetadata('githubblobpath');
  const commitsUrl = blobUrl?.replace('/blob/', '/commits/');

  const firstDiv = block.querySelector('div');
  firstDiv.classList.add("contributors-content");
  block.querySelectorAll('p').forEach(p => p.remove());

  block.querySelectorAll('div').forEach((d) => {
    if (!d.hasChildNodes())
      d.remove();
  });

  const lastUpdate = document.createElement("div");
  lastUpdate.classList.add("lastUpdateDetails");
  const lastUpdatedWrapper = document.createElement("a");
  if (commitsUrl) {
    lastUpdatedWrapper.href = commitsUrl;
    lastUpdatedWrapper.target = "_blank";
  }
  lastUpdate.appendChild(lastUpdatedWrapper);

  const imageList = document.createElement("div");
  imageList.classList.add("imageList");
  avatars.forEach(src => {
    const img = document.createElement('img');
    img.src = src;
    img.classList.add("image-contributor");
    const span = document.createElement('span');
    span.classList.add('span-Image-contributor');
    span.appendChild(img);
    imageList.appendChild(span);
  });
  lastUpdatedWrapper.appendChild(imageList);

  const lastUpdatedText = document.createElement("span");
  lastUpdatedText.classList.add("lastUpdatedText");
  lastUpdatedText.innerText = lastUpdated ? `Last updated ${lastUpdated}` : '';
  lastUpdatedWrapper.appendChild(lastUpdatedText);

  const feedback = document.createElement("div");
  feedback.classList.add("feedback");
  const feedbackWrapper = document.createElement("div");
  feedbackWrapper.classList.add("feedbackWrapper");
  feedback.appendChild(feedbackWrapper);

  const helpfulText = document.createElement("span");
  helpfulText.innerText = "Was this helpful?";
  feedbackWrapper.appendChild(helpfulText);

  const buttonWrapper = document.createElement("div");
  buttonWrapper.classList.add("buttonWrapper");
  feedbackWrapper.appendChild(buttonWrapper);

  const yesButton = document.createElement("button");
  yesButton.classList.add("spectrum-Button", "spectrum-Button--sizeM", "spectrum-Button--outline", "spectrum-Button--secondary");
  yesButton.setAttribute("daa-ll", "Feedback-Yes")
  yesButton.innerText = "Yes";

  const noButton = document.createElement("button");
  noButton.classList.add("spectrum-Button", "spectrum-Button--sizeM", "spectrum-Button--outline", "spectrum-Button--secondary");
  noButton.setAttribute("daa-ll", "Feedback-No")
  noButton.innerText = "No";

  buttonWrapper.append(yesButton, noButton);

  firstDiv.append(lastUpdate, feedback);

  const showModal = () => {
    const modal = document.querySelector('.contributor-modal');
    modal.style.display = 'block';
    setTimeout(() => {
      modal.classList.add('show');
    }, 0);
  };

  const closeModal = () => {
    const modal = document.querySelector('.contributor-modal');
    modal.classList.remove('show');
    setTimeout(() => {
      modal.style.display = 'none';
    }, 10);
  }

  const handleFeedback = (selectedButton) => {
    feedbackWrapper.classList.add('feedback-submitted');
    selectedButton.classList.add('selected');
    showModal();
  };

  yesButton.addEventListener('click', () => handleFeedback(yesButton));
  noButton.addEventListener('click', () => handleFeedback(noButton));
  modal.querySelector('.close-button').addEventListener('click', closeModal);
  window.addEventListener('click', (event) => {
    if (event.target === document.querySelector('.model-comp-contributors')) closeModal();
  });
}
