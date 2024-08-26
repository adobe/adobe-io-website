/**
 * Decorates the contributors block
 * @param {Element} block The contributors block element
 */
export default async function decorate(block) {

  const isBorder = block?.parentElement?.parentElement?.getAttribute("data-isborder");

  if (isBorder) {
    block?.parentElement?.parentElement?.classList.add("wrapper-border")
  }

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

  const github_user_profile_pic = [
    "https://github.com/hollyschinsky.png",
    "https://github.com/vamshich13.png",
    "https://github.com/nimithajalal.png"
  ];

  const contribution_date = "2/21/2024";

  const firstDiv = block.querySelector('div');
  firstDiv.classList.add("contibutors-wrapper-comp");
  block.querySelectorAll('p').forEach(p => p.remove());

  block.querySelectorAll('div').forEach((d) => {
    if (!d.hasChildNodes())
      d.remove();
  });

  const lastUpdate = document.createElement("div");
  lastUpdate.classList.add("lastUpdateDetails");
  const lastUpdateWrapper = document.createElement("a");
  lastUpdateWrapper.href = "https://github.com/AdobeDocs/express-add-ons-docs/commits/main/src/pages/references/index.md";
  lastUpdateWrapper.target = "_blank";
  lastUpdate.appendChild(lastUpdateWrapper);

  const imageList = document.createElement("div");
  imageList.classList.add("imageList");
  github_user_profile_pic.forEach(src => {
    const img = document.createElement('img');
    img.src = src;
    img.classList.add("image-contributor");
    const span = document.createElement('span');
    span.classList.add('span-Image-contributor');
    span.appendChild(img);
    imageList.appendChild(span);
  });
  lastUpdateWrapper.appendChild(imageList);

  const imageTextWrapper = document.createElement("span");
  imageTextWrapper.innerText = `Last updated ${contribution_date}`;
  lastUpdateWrapper.appendChild(imageTextWrapper);

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
  yesButton.classList.add("spectrum-Button", "spectrum-Button--sizeM", "spectrum-Button--outline", "spectrum-Button--primary");
  yesButton.setAttribute("daa-ll", "Feedback-Yes")
  yesButton.innerText = "Yes";

  const noButton = document.createElement("button");
  noButton.classList.add("spectrum-Button", "spectrum-Button--sizeM", "spectrum-Button--outline", "spectrum-Button--primary");
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

  yesButton.addEventListener('click', showModal);
  noButton.addEventListener('click', showModal);
  modal.querySelector('.close-button').addEventListener('click', closeModal);
  window.addEventListener('click', (event) => {
    if (event.target === modal.querySelector('.spectrum-Underlay')) closeModal();
  });
}
