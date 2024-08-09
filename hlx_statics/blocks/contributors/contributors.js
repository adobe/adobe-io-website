/**
 * decorates the contributers
 * @param {Element} block The contributers block element
 */
 export default async function decorate(block) {
  const modal = document.createElement("div");
  modal.classList.add("modal");
  modal.innerHTML = `
    <div>
      <div data-testid="underlay" class="spectrum-Underlay spectrum-overlay is-open spectrum-overlay--open" aria-hidden="true" style="overflow: hidden;"></div>
      <div class="model-comp" >
        <div class="spectrum-Modal is-open show-model" data-testid="modal" >
          <section style="justify-content : center" class="spectrum-Dialog spectrum-Dialog--medium spectrum-Dialog--confirmation" role="alertdialog" tabIndex="-1" aria-modal="true">
            <div class="wrapper-model">
              <h1 class="spectrum-Dialog-heading spectrum-Dialog-heading--noHeader">Thank you for your feedback</h1>
              <hr />
              <p class="spectrum-Body spectrum-Body--sizeM" > Thank you for helping improve Adobe's documentation. </p>
              <section class="spectrum-Dialog-content">
                <div class="content-wrapper">
                    <div class="button-wrapper">
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

  document.body.appendChild(modal);

  const style = document.createElement('style');
  style.innerHTML = `
    .modal {
      display: none;
      position: fixed;
      z-index: 1;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
      overflow: auto;
      background-color: rgba(0, 0, 0, 0.4);
    }
  `;
  document.head.appendChild(style);

  const firstDiv = block.firstElementChild.lastElementChild;
  firstDiv.classList.add("contibutors-wrapper-comp");
  block.querySelectorAll('p').forEach((p) => {
    p.remove();
  });

  const lastUpdate = document.createElement("div");
  lastUpdate.classList.add("lastUpdateDetails");

  const lastUpdateWrapper = document.createElement("a");
  lastUpdate.append(lastUpdateWrapper);
  lastUpdateWrapper.setAttribute("href", "");
  lastUpdateWrapper.setAttribute("target", "_blank");

  const imageList = document.createElement("div");
  imageList.classList.add("imageList");
  lastUpdateWrapper.appendChild(imageList);

  const img = document.createElement("img");
  img.src = "https://github.com/hollyschinsky.png";

  const imageWrapper = document.createElement("div");
  imageList.appendChild(imageWrapper);
  imageList.appendChild(img);

  const imageTextWrapper = document.createElement("span");
  imageTextWrapper.innerText = "Last updated 2/21/2024";
  lastUpdateWrapper.appendChild(imageTextWrapper);

  const feedback = document.createElement("div");
  feedback.classList.add("feedback");

  const feedbackWrapper = document.createElement("div");
  feedback.appendChild(feedbackWrapper);
  feedbackWrapper.classList.add("feedbackWrapper");

  const helpfulText = document.createElement("span");
  helpfulText.innerText = "Was this helpful?";
  feedbackWrapper.appendChild(helpfulText);

  const buttonWrapper = document.createElement("div");
  feedbackWrapper.appendChild(buttonWrapper);
  buttonWrapper.classList.add("buttonWrapper");

  const yesButton = document.createElement("button");
  yesButton.setAttribute("daa-ll", "Feedback-Yes");
  yesButton.innerHTML = "Yes";

  const noButton = document.createElement("button");
  noButton.setAttribute("daa-ll", "Feedback-No");
  noButton.innerHTML = "No";

  buttonWrapper.appendChild(yesButton);
  buttonWrapper.appendChild(noButton);

  firstDiv.appendChild(lastUpdate);
  firstDiv.appendChild(feedback);

  block.querySelectorAll("button").forEach((btn) => {
    btn.classList.add("spectrum-Button", "spectrum-Button--sizeM", "spectrum-Button--outline", "spectrum-Button--primary");
  });

  const showModal = () => {
    modal.style.display = 'block';
  };

  const closeModal = () => {
    modal.style.display = 'none';
  };

  yesButton.addEventListener('click', () => {
    showModal();
  });

  noButton.addEventListener('click', () => {
    showModal();
  });

  modal.querySelector('.close-button').addEventListener('click', closeModal);

  window.addEventListener('click', (event) => {
    if (event.target === modal) {
      closeModal();
    }
  });
}
