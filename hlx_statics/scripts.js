const $FOOTER_LINKS = 
[
  {
    "name": "Api",
    "links": [
      { "name": "Adobe Creative Cloud", "url": "https://www.adobe.io/apis/creativecloud" },
      { "name": "Adobe Experience Platform", "url": "https://www.adobe.io/apis/experienceplatform/home" },
      { "name": "Adobe Document Cloud", "url": "https://www.adobe.io/apis/documentcloud" },
      { "name": "Adobe Experience Cloud", "url": "https://www.adobe.io/apis/experiencecloud" }
  ]
  },
  {
    "name": "Service",
    "links": [
      { "name": "Adobe XD", "url": "https://www.adobe.io/apis/creativecloud/xd" },
      { "name": "Adobe Target", "url": "https://www.adobe.io/apis/experiencecloud/target" },
      { "name": "Adobe Analytics", "url": "https://www.adobe.io/apis/experiencecloud/analytics" },
      { "name": "Project Firefly", "url": "https://www.adobe.io/apis/experienceplatform/project-firefly" }
    ]
  },
  {
    "name": "Community",
    "links": [
      { "name": "Adobe Tech Blog", "url": "https://medium.com/adobetech" },
      { "name": "Adobe on GitHub", "url": "https://github.com/adobe" },
      { "name": "Adobe Developer on YouTube", "url": "https://youtube.com/channel/UCDtYqOjS9Eq9gacLcbMwhhQ" },
      { "name": "Adobe Developer on Twitter", "url": "https://twitter.com/adobedevs" },
      { "name": "Community Forums", "url": "https://adobe.com/communities/index.html" }
    ]
  },
  {
    "name": "Support",
    "links": [
      { "name": "Contact us", "url": "https://www.adobe.io/contactus" },
      { "name": "Adobe Developer support", "url": "https://www.adobe.io/support" },
      { "name": "Adobe Product support", "url": "https://helpx.adobe.com/contact/enterprise-support.html" }
    ]
  },
  {
    "name": "Developer",
      "links": [
      { "name": "Adobe I/O console", "url": "https://console.adobe.io/" },
      { "name": "Open source at Adobe", "url": "https://www.adobe.io/open" },
      { "name": "Download SDKs", "url": "https://console.adobe.io/downloads" },
      { "name": "Authentication", "url": "https://www.adobe.io/authentication.html" },
      { "name": "Careers", "url": "https://adobe.com/careers.html" }
    ]
  },
  {
    "name": "Legal",
      "links": [
      { "name": "Terms of use", "url": "https://adobe.com/legal/terms.html" },
      { "name": "Privacy policy", "url": "https://adobe.com/privacy.html" },
      { "name": "Cookies", "url": "https://adobe.com/privacy/cookies.html" },
      { "name": "AdChoices", "url": "https://adobe.com/privacy/opt-out.html#interest-based-ads" }
    ]
  },
];

  /**
   * Creates a tag with the given name and attributes.
   * @param {string} name The tag name
   * @param {object} attrs An object containing the attributes
   * @returns The new tag
   */
  function createTag(name, attrs) {
    const el = document.createElement(name);
    if (typeof attrs === "object") {
      for (let [key, value] of Object.entries(attrs)) {
        el.setAttribute(key, value);
      }
    }
    return el;
  }

  function toClassName(name) {
    return name.toLowerCase().replace(/[^0-9a-z]/gi, "-");
  }

  /**
   * Loads a CSS file.
   * @param {string} href The path to the CSS file
   */
  function loadCSS(href) {
    const link = document.createElement("link");
    link.setAttribute("rel", "stylesheet");
    link.setAttribute("href", href);
    document.head.appendChild(link);
  }

  /**
   * Turn tables to DIV.
   * @param {object} $table Table element
   */

  function tableToDivs($table) {
    const $rows = $table.querySelectorAll("tbody tr");
    const blockname = $table.querySelector("th").textContent;
    const $block = createTag("div", { class: `${toClassName(blockname)}` });
    $rows.forEach(($tr) => {
      const $row = createTag("div");
      $tr.querySelectorAll("td").forEach(($td, i) => {
        const $div = createTag("div");
        $div.innerHTML = $td.innerHTML;
        $row.append($div);
      });
      $block.append($row);
    });
    return $block;
  }

  function removeEmptyPTags($theElement){
    $theElement.querySelectorAll('p').forEach(($pElement) => {
      // get rid of empty p tags
      if(!$pElement.hasChildNodes()){
        $pElement.remove();
      }
    })
  }

  function decorateTables() {
    document.querySelectorAll("main div>table").forEach(($table) => {
      const $div = tableToDivs($table);
      $table.parentNode.replaceChild($div, $table);
    });
  }

  function decorateBlocks() {
    document
      .querySelectorAll("main>div.section-wrapper>div>div")
      .forEach(($block) => {
        const classes = Array.from($block.classList.values());
        loadCSS(`/hlx_statics/blocks/${classes[0]}.css`);
        $block
          .closest(".section-wrapper")
          .classList.add(`${classes[0]}-container`);
      });
  }

  function decorateBackgroundImageBlocks() {
    document
      .querySelectorAll("main div.background-image")
      .forEach(($bgImgDiv) => {
        const $images = $bgImgDiv.querySelectorAll("img");
        const $lastImage = $images[$images.length - 1];

        const $section = $bgImgDiv.closest(".section-wrapper");
        if ($section && $lastImage) {
          $section.style.backgroundImage = `url(${$lastImage.src})`;
          let $caption = $lastImage.nextElementSibling;
          if ($caption) {
            if ($caption.textContent == "")
              $caption = $caption.nextElementSibling;
            if ($caption) $caption.classList.add("background-image-caption");
          }
          $lastImage.remove();
        }
      });
  }

  function decorateEmbeds() {
    document.querySelectorAll('a[href]').forEach(($a) => {
      if ($a.textContent.startsWith('https://')) {
        const url=new URL($a.href);
        const usp=new URLSearchParams(url.search);
        let embedHTML='';
        let type='';

        if ($a.href.startsWith('https://www.youtube.com/watch')) {
          const vid=usp.get('v');
          
          type='youtube';
          embedHTML=`<div style="left: 0; width: 100%; height: 0; position: relative; padding-bottom: 56.25%;">
            <iframe src="https://www.youtube.com/embed/${vid}?rel=0&amp;v=${vid}" style="border: 0; top: 0; left: 0; width: 100%; height: 100%; position: absolute;" allowfullscreen="" scrolling="no" allow="encrypted-media; accelerometer; gyroscope; picture-in-picture" title="content from youtube" loading="lazy"></iframe>
            </div>
          `;
        }
    
        if (type) {
          const $embed=createTag('div', {class: `embed embed-oembed embed-${type} column-embed`});
          const $div=$a.closest('div');
          $embed.innerHTML=embedHTML;
          $div.parentElement.replaceChild($embed, $div);
        }  
      }
    })

    // helix auto injects youtube vids as a small thumbnail - make sure
    // to take only the embeds not in the column view
    document.querySelectorAll('.embed-youtube > iframe').forEach(($embed) => {
      if(!$embed.parentElement.classList.contains('column-embed')){

        $embed.setAttribute('height', '350px');
        $embed.setAttribute('width', '100%');
      }
    });
  }

  function decorateButtons() {
    document.querySelectorAll("main a").forEach(($a) => {
      const $button = createTag('button');
      $button.addEventListener('click', () => {
        window.location.href = $a.href;
      })
      $button.innerHTML = `<span class="spectrum-Button-label">${$a.innerHTML}</span>`
      const $up = $a.parentElement;
      const $twoup = $a.parentElement.parentElement;
      if ($up.childNodes.length == 1 && $up.tagName == "P") {
        $button.className = 'spectrum-Button spectrum-Button--secondary  spectrum-Button--sizeM';
        $up.replaceChild($button, $a);
      }
      if (
        $up.childNodes.length == 1 &&
        $up.tagName == "STRONG" &&
        $twoup.childNodes.length == 1 &&
        $twoup.tagName == "P"
      ) {
        $button.className = 'spectrum-Button spectrum-Button--cta  spectrum-Button--sizeM';
        $twoup.replaceChild($button, $up);
      }
    });


    // const $consoleButton = document.querySelector("header p:last-child a");
    // $consoleButton.className = "button secondary";
  }

  function decorateIframe() {
    document.querySelectorAll(".iframe a").forEach(($a) => {
      if ($a.textContent.startsWith("https://")) {
        const url = new URL($a.href);

        let embedHTML = `<div>
      <iframe src="${$a.href}" style="border: 0; width: 100%; height: 100%; position: absolute;"></iframe>
      </div>
      `;

        let type = "iframe";

        if (type) {
          const $embed = createTag("div", {
            class: `embed embed-oembed embed-${type}`,
          });
          const $div = $a.closest("div");
          $embed.innerHTML = embedHTML;
          $div.parentElement.replaceChild($embed, $div);
        }
      }
    });
  }

  function wrapSections(element) {
    document.querySelectorAll(element).forEach(($div) => {
      const $wrapper = createTag("div", { class: "section-wrapper" });
      $div.parentNode.appendChild($wrapper);
      $wrapper.appendChild($div);
    });
  }

  function footerListItem(name, url) {
    return `
      <li>
        <a href="${url}" class="spectrum-Link spectrum-Link--secondary spectrum-Link--quiet">${name}</a>
      </li>
    `;
  }

  function decorateFooter() {
    document.querySelectorAll('footer').forEach(($footer) => {


      let $apiLinksHTML = '';
      $FOOTER_LINKS[0].links.forEach(($link) => {
        $apiLinksHTML += footerListItem($link.name, $link.url)
      });

      let $servicesLinksHTML = '';
      $FOOTER_LINKS[1].links.forEach(($link) => {
        $servicesLinksHTML += footerListItem($link.name, $link.url)
      });

      let $apisTemplate = `
      <div class="footer-apis">
        <div class="footer-apis-container">
          <div class="footer-apis-inner">
            <h3 class="spectrum-Heading--XS">APIs and Services</h3>
            <ul class="spectrum-Body spectrum-Body--sizeS">
              ${$apiLinksHTML}
              <li>
                <a href="https://www.adobe.io/apis/" class="spectrum-Link spectrum-Link--quiet">
                  <strong>
                    View all
                  </strong>
                </a>
              </li>
            </ul>
          </div>
          <div class="footer-services-container">
            <ul class="spectrum-Body spectrum-Body--sizeS">
              ${$servicesLinksHTML}
            </ul>
          </div>
        </div>
        <div class="footer-divider">
          <div class="spectrum-Divider spectrum-Divider--sizeM spectrum-Divider--vertical" style="height: 100%; align-self: stretch;"></div>
        </div>
      </div>
      `;

      let $communityLinksHTML = '';
      $FOOTER_LINKS[2].links.forEach(($link) => {
        $communityLinksHTML += footerListItem($link.name, $link.url)
      });

      let $communityTemplate = `
      <div class="footer-community">
        <div class="footer-community-container">
          <div>
          <h3 class="spectrum-Heading--XS">Community</h3>
            <ul class="spectrum-Body spectrum-Body--sizeS">
              ${$communityLinksHTML}
            </ul>
          </div>
        </div>
        <div class="footer-divider">
        <div class="spectrum-Divider spectrum-Divider--sizeM spectrum-Divider--vertical" style="height: 100%; align-self: stretch;"></div>
        </div>
      </div>
      `;

      let $supportLinksHTML = '';
      $FOOTER_LINKS[3].links.forEach(($link) => {
        $supportLinksHTML += footerListItem($link.name, $link.url)
      });

      let $supportTemplate = `
      <div class="footer-support">
      <div class="footer-support-container">
        <div>
        <h3 class="spectrum-Heading--XS">Support</h3>
          <ul class="spectrum-Body spectrum-Body--sizeS">
            ${$supportLinksHTML}
          </ul>
        </div>
      </div>
      <div class="footer-divider">
      <div class="spectrum-Divider spectrum-Divider--sizeM spectrum-Divider--vertical" style="height: 100%; align-self: stretch;"></div>
      </div>
    </div>
      `;


      let $developerLinksHTML = '';
      $FOOTER_LINKS[4].links.forEach(($link) => {
        $developerLinksHTML += footerListItem($link.name, $link.url)
      });

      let $developerTemplate = `
      <div class="footer-developer">
      <div class="footer-developer-container">
        <div>
        <h3 class="spectrum-Heading--XS">Adobe Developer</h3>
          <ul class="spectrum-Body spectrum-Body--sizeS">
            ${$developerLinksHTML}
          </ul>
        </div>
      </div>
      <div class="footer-divider">
      <div class="spectrum-Divider spectrum-Divider--sizeM spectrum-Divider--vertical" style="height: 100%; align-self: stretch;"></div>
      </div>
    </div>
      `;

      let $legalLinksHTML = '';
      $FOOTER_LINKS[4].links.forEach(($link) => {
        $legalLinksHTML += footerListItem($link.name, $link.url)
      });

      let $legalLinksTemplate = `
      <div
        class="spectrum-Divider spectrum-Divider--sizeM "
        style="margin-top: var(--spectrum-global-dimension-size-700)"
      ></div>
      <div
        class="footer-legal">
        <div>
          <ul
            class="spectrum-Body spectrum-Body--sizeXS">
            ${$legalLinksHTML}
          </ul>
        </div>
        <div>
          <span
            class="spectrum-Body spectrum-Body--sizeXS footer-date">
            Copyright © ${new Date().getFullYear()} Adobe. All rights reserved.
          </span>
        </div>
      </div>
      `;

      let $footerTemplate = `
        <div class="footer-links-container">
          <div class="footer-links-container-inner">
            ${$apisTemplate}
            ${$communityTemplate}
            ${$supportTemplate}
            ${$developerTemplate}
          </div>
          ${$legalLinksTemplate}
        </div>
      `;
      const $footerContainer = createTag('div', {class: 'footer-links-container'});
      $footerContainer.innerHTML = $footerTemplate;
      $footer.prepend($footerContainer);
    });
  }

  function decorateHero() {
    document.querySelectorAll('.hero-container').forEach(($heroSection) => {
      removeEmptyPTags($heroSection);

      $heroSection.querySelectorAll('.hero').forEach(($hero) => {
        $hero.classList.add('spectrum--lightest')
      });

      $heroSection.querySelectorAll('img.icon').forEach(($heroIcon) => {
        $heroIcon.parentElement.classList.add('icon-container');
      })

      $heroSection.querySelectorAll('h1, h2, h3, h4, h5, h6').forEach(($header) => {
        $header.classList.add('spectrum-Heading', 'spectrum-Heading--sizeXXL', 'spectrum-Heading--serif');
      })

      $heroSection.querySelectorAll('p').forEach(($p) => {
        const $hasLinks = $p.querySelectorAll('a, button');
        // don't attach to icon container or if p tag contains links
        if(!$p.classList.contains('icon-container') && $hasLinks.length === 0) {
          $p.classList.add('spectrum-Body', 'spectrum-Body--sizeL');
        }
      });

      // put buttons into their own div
      const $buttonContainer = createTag('div', {class: 'hero-button-container'});
      $heroSection.querySelectorAll('button').forEach(($button) => {
        $button.classList.add('spectrum-Button--quiet')
        $buttonContainer.append($button);
      });

      // have to remove ps after moving buttons
      removeEmptyPTags($heroSection);

      const $firstSection = $heroSection.querySelector('div.hero>div>div');
      $firstSection.append($buttonContainer);
    });
  }

  function decorateTitle($container, $containerClass) {
    // search container for h's and p's not inside a container and apply title block classes
    $container.querySelectorAll('p').forEach(($pTag) => {
      const $mainContainer = $container.querySelector('div.'+ $containerClass);
      if(!$mainContainer.contains($pTag)) {
        $pTag.classList.add('title-body', 'spectrum-Body--sizeL', 'spectrum-Body--light');
      }
    })

    $container.querySelectorAll('h1, h2, h3, h4, h5, h6').forEach(($hTag) => {
      const $mainContainer = $container.querySelector('div.'+ $containerClass);
      if(!$mainContainer.contains($hTag)) {
        $hTag.classList.add('title-header', 'spectrum-Heading--sizeL', 'spectrum-Heading--light');
      }
    })
  }

  function readBlockConfig($block) {
    const config = {};
    $block.querySelectorAll(":scope>div").forEach(($row) => {
      if ($row.children && $row.children[1]) {
        const name = toClassName($row.children[0].textContent);
        const $a = $row.children[1].querySelector("a");
        let value = "";
        if ($a) value = $a.href;
        else value = $row.children[1].textContent;
        config[name] = value;
      }
    });
    return config;
  }

  function displayFilteredCards(catalog, $cards, buttons, limit, filters) {
    $cards.innerHTML = "";
    let counter = 0;
    catalog.forEach((card) => {
      let show = true;
      if (filters && filters[0]) {
        if (!filters.includes(card.Category)) show = false;
      }

      if (counter >= limit) show = false;
      if (show) {

        let iconTemplate = '';
        if(card.Icon) {
          iconTemplate = `
            <div class="api-card-icon-container">
              <img
                class="api-card-icon"
                src="/hlx_statics/icons/${card.Icon}.svg"
              />
            </div>
          `
        }

        let buttonTemplate = '';
        buttons.forEach((b, i) => {
          if (card[b]) {
            if(i === 0){
              buttonTemplate += 
                `<button onClick="location.href=${card[b]}" class="spectrum-Button spectrum-Button--secondary spectrum-Button--quiet spectrum-Button--sizeM">
                  <span class="spectrum-Button-label">${b}</span>
                </button>`
            
            } else {
              buttonTemplate +=
              `
              <button onClick="location.href=${card[b]}" class="spectrum-Button spectrum-Button--primary spectrum-Button--sizeM">
                <span class="spectrum-Button-label">${b}</span>
              </button>
              `
            
            }
          }
        });

        let cardTemplate = `
<div class="api-card spectrum--lightest">
  <div
    class="spectrum-Card api-card-inner"
    role="figure"
    tabindex="0"
    dir="ltr"
  >
    <div class="spectrum-Card-body api-card-body">
      ${iconTemplate}
      <div class="api-card-body-inner">
        <div
          class="api-card-title-container spectrum-Card-header spectrum-Heading spectrum-Heading--sizeXXS"
        >
          <div class="api-card-title spectrum-Card-title">
            <strong><h4>${card.Title}</h4></strong>
          </div>
        </div>
        <div
          class="spectrum-Card-content spectrum-Body spectrum-Body--sizeS api-card-content"
        >
          ${card.Description}
        </div>
      </div>
    </div>
    <div class="spectrum-Card-footer">
        <div class="api-card-button-container">
          ${buttonTemplate}
        </div>
    </div>
  </div>
</div>
`;

        $cards.innerHTML += cardTemplate;
        counter++;
      }
    });
  }

  function decorateHeader() {
    let $header = document.querySelector('header');

    let $pContainer = document.createElement('p');
    let $pContent = document.createTextNode('Adobe I/O');
    let $imgContainer = document.createElement('img');

    $imgContainer.classList.add('icon', 'icon-adobe');
    $imgContainer.src = '/hlx_statics/icons/adobe.svg';
    $imgContainer.alt = 'adobe icon';

    $pContainer.appendChild($imgContainer);
    $pContainer.appendChild($pContent);

    let $ulContainer = document.createElement('ul');

    document.querySelectorAll(".nav a").forEach(($item) => {
      let $liContainer = document.createElement('li');
      $liContainer.appendChild($item);
      $ulContainer.appendChild($liContainer);
    });

    $header.appendChild($pContainer);
    $header.appendChild($ulContainer);

    let $aLink = document.createElement('a');
    $aLink.href = 'https://console.adobe.io/';
    $aLink.textContent = 'Console';

    let $strong = document.createElement('strong');
    $strong.appendChild($aLink);

    $pContainer = document.createElement('p');
    $pContainer.appendChild($strong);

    $header.appendChild($pContainer);
    
    const $navContainer = document.querySelector('.nav');
    $navContainer.remove();
  }

  function decorateAnnouncement() {
    document.querySelectorAll(".announcement").forEach(($announcement) => {
      removeEmptyPTags($announcement);
      $announcement.querySelectorAll('br').forEach(($br) => {
        $br.remove();
      });

      $announcement.querySelectorAll('h1, h2, h3, h4, h5, h6').forEach(($h) => {
        $h.classList.add('spectrum-Heading', 'spectrum-Heading--sizeM', 'announce-heading');
      });


      $announcement.querySelectorAll('p a').forEach(($link) => {
        $link.parentElement.classList.add('announce-link');
      });


    });
  }

  function decorateAPIBrowser() {
    document.querySelectorAll('.api-browser-container').forEach(($apiBrowserContainer) => {
      decorateTitle($apiBrowserContainer, 'api-browser');
    });

    document.querySelectorAll(".api-browser").forEach(async ($apiBrowser) => {
      $apiBrowser.classList.add('spectrum--light');
      const config = readBlockConfig($apiBrowser);
      window.aio = window.aio || {};
      const resp = await fetch("/api-catalog.json");
      window.aio.apiCatalog = (await resp.json()).data;
      const catalog = window.aio.apiCatalog;
      let buttons = ["Learn More", "View Docs"];

      if (config.display)
        buttons = config.display.split(",").map((e) => e.trim());

      $apiBrowser.innerHTML = "";
      if (config.filters == "Show") {
        const categories = catalog
          .map((e) => e.Category)
          .filter((v, i, self) => {
            return self.indexOf(v) === i;
          });

        const $cards = createTag("div", { class: "api-cards" });

        const $apiCardsInner = createTag("div", { class: 'api-cards-inner' });

        const $filters = createTag("div", { class: "filters" });
        const $filtersInner = createTag('div', { class: 'filters-inner'});
         
        $filtersInner.innerHTML = `<strong><h4 class="spectrum-Heading--XS">Filter by</h4></strong>`;
        
        categories.forEach((c) => {
          const $filter = createTag("div");
          const id = toClassName(c);

  
          $filter.innerHTML = `
          
            <label class="spectrum-Checkbox spectrum-Checkbox--emphasized spectrum-Checkbox--sizeM" for="${id}">
              <input type="checkbox" class="spectrum-Checkbox-input" id="${id}" name="${id}" value="${c}">
              <span class="spectrum-Checkbox-box">
                <svg class="spectrum-Icon spectrum-UIIcon-Checkmark100 spectrum-Checkbox-checkmark" focusable="false" aria-hidden="true">
                  <use xlink:href="#spectrum-css-icon-Checkmark100" />
                </svg>
                <svg class="spectrum-Icon spectrum-UIIcon-Dash100 spectrum-Checkbox-partialCheckmark" focusable="false" aria-hidden="true">
                  <use xlink:href="#spectrum-css-icon-Dash100" />
                </svg>
              </span>
              <span class="spectrum-Checkbox-label" dir="ltr"> ${c}</span>
            </label>
          <br />
        `;

          $filter.addEventListener("click", (evt) => {
            const filters = [];
            $filtersInner
              .querySelectorAll(`:checked`)
              .forEach(($cb) => filters.push($cb.value));
            displayFilteredCards(catalog, $cards, buttons, config.limit, filters);
          });
          $filtersInner.append($filter);
        });

        $filters.append($filtersInner);
        $apiCardsInner.append($filters);
        $apiCardsInner.append($cards);
        $apiBrowser.append($apiCardsInner);
        displayFilteredCards(catalog, $cards, buttons, config.limit);
      }
    });
  }

  function decorateCards() {
    document.querySelectorAll('.cards').forEach(($card) => {
      removeEmptyPTags($card);
    });
  }

  function decorateColumns() {
    document.querySelectorAll('.columns').forEach(($column) => {
      removeEmptyPTags($column);

      $column.querySelectorAll('img + a').forEach(($productLink) => {
        // this is annoying - sometimes it's wrapper is in p and sometimes not?
        // is it when gdoc has two icons in a row that p will be used?
        if($productLink.parentElement.tagName === 'P') {
          $productLink.parentElement.classList.add('product-link');
        } else {
          let $pContainer = createTag('p', { class: 'product-link'});

          let $newImg = $productLink.previousSibling.previousSibling.cloneNode(true);
          let $newP = $productLink.cloneNode(true);

          $pContainer.append($newImg);
          $pContainer.append($newP);
          $productLink.previousSibling.previousSibling.remove();
          $productLink.parentNode.replaceChild($pContainer, $productLink);
        }
      });

      $column.childNodes.forEach(($row) => {
        if($row.childNodes.length > 1) {
          let $textColumnContainer = createTag('div', { class : 'columns-text'});

          // find the text column in the row and wrap it then insert it 
          let $cloneNodes;
          if($row.childNodes[0].textContent.length > 0) {
            $cloneNodes = $row.childNodes[0].cloneNode(true);
            $textColumnContainer.append($cloneNodes); 
            $row.replaceChild($textColumnContainer, $row.childNodes[0]);
          } else if($row.childNodes[1].textContent.length > 0) {
            $cloneNodes = $row.childNodes[1].cloneNode(true);
            $textColumnContainer.append($cloneNodes); 
            $row.replaceChild($textColumnContainer, $row.childNodes[1]);
          }
        } 
      });
    });

    document.querySelectorAll('.columns-dark').forEach(($column) => {
      removeEmptyPTags($column);

      // re-wrap second container so it's easier to vertically align
      $column.childNodes.forEach(($row) => {
        if($row.childNodes.length > 1) {
          let $textColumnContainer = createTag('div', { class : 'columns-text'});

          // find the text column in the row and wrap it then insert it 
          // may have to expand search to allow all media types instead of just iframe
          let $cloneNodes;
          if(!$row.childNodes[0].querySelector('iframe')) {
            $cloneNodes = $row.childNodes[0].cloneNode(true);
            $textColumnContainer.append($cloneNodes); 
            $row.replaceChild($textColumnContainer, $row.childNodes[0]);

          } else if(!$row.childNodes[1].querySelector('iframe')) {
            $cloneNodes = $row.childNodes[1].cloneNode(true);
            $textColumnContainer.append($cloneNodes); 
            $row.replaceChild($textColumnContainer, $row.childNodes[1]);
          }
        } 
      });
    });
  }

  function decorateResourceCards() {
    document.querySelectorAll('.section-wrapper').forEach(($section) => {
      $section.querySelectorAll('.resource-card-large').forEach(($resourceLarge) => {

        // find the image
        let $image = $resourceLarge.querySelector('img');
        if($image) {
          let $imageContainer = $image.parentElement;
    
          $imageContainer.style.backgroundImage = 'url('+ $image.src + ')';
          $imageContainer.classList.add('resource-card-large-image-container');
    
          $image.remove();
        }
    
        let $link = $resourceLarge.querySelector('a');
        if($link) {
          $resourceLarge.addEventListener('click', url => {
            window.open($link.href, '_blank');
          });
          $link.remove();
        }
    
        let $resourceLargeContainer = createTag('div', { class: 'resource-card-large-container-inner'});
        let $resourceLargeContainerParent = $resourceLarge.parentElement;
    
        $resourceLargeContainer.append($resourceLarge);
        $resourceLargeContainerParent.append($resourceLargeContainer);
        removeEmptyPTags($resourceLarge);
      });
    
      // take two small resource cards and wrap em
      let $containerParent = $section.querySelector('.resource-card-small-container > div');
      let $resourceSmallContainer = createTag('div', { class: 'resource-card-small-container-inner'});

      let $resourceSmallContainerSecond = createTag('div', { class: 'resource-card-small-container-inner'});
      $section.querySelectorAll('.resource-card-small').forEach(($resourceSmall, index) => {
        // find the image
        let $image = $resourceSmall.querySelector('img');
        if($image) {
          let $imageContainer = $image.parentElement;
    
          $imageContainer.style.backgroundImage = 'url('+ $image.src + ')';
          $imageContainer.classList.add('resource-card-small-image-container');
    
          $image.remove();
        }
    
        let $link = $resourceSmall.querySelector('a');
        if($link) {
          $resourceSmall.addEventListener('click', url => {
            window.open($link.href, '_blank');
          });
          $link.remove();
        }

        // annoying logic to wrap two small cards vs four
        if(index <= 1) {
          $resourceSmallContainer.append($resourceSmall);
        } else {
          $resourceSmallContainerSecond.append($resourceSmall);
          $containerParent.append($resourceSmallContainerSecond);
        }
        removeEmptyPTags($resourceSmall);
      });
    
      if($containerParent) {
        $containerParent.append($resourceSmallContainer);
      }
    
      let $resourceFlexContainer = createTag('div', {class: 'resource-card-flex-container'});
      $section.querySelectorAll('.resource-card-large-container-inner').forEach(($largeSection) => {
        $resourceFlexContainer.append($largeSection);
      });

      $section.querySelectorAll('.resource-card-small-container-inner').forEach(($smallSection) => {
        $resourceFlexContainer.append($smallSection);
      });
      $section.append($resourceFlexContainer);
    });
  
  }

  function decorateSummary() {
    document.querySelectorAll(".summary-container").forEach(($summary) => {
      $backgroundImg = $summary.querySelector('img');
      $summary.style.backgroundImage = 'url('+ $backgroundImg.src + ')';
      $backgroundImg.remove();
      removeEmptyPTags($summary);

      // fix up button styling
      let $linkContainer = createTag('div', {class: 'summary-link-container'});
      const $primaryLink = $summary.querySelector('p > strong');
      if($primaryLink) {
        $primaryLink.parentElement.classList.add('summaryPrimaryLink');
        $linkContainer.append($primaryLink.parentElement);
      }

      const $secondaryLink = $summary.querySelector('p > a');
      if($secondaryLink) {
        $secondaryLink.parentElement.classList.add('summarySecondaryLink');
        $linkContainer.append($secondaryLink.parentElement);
      }

      let $textContainer = $summary.querySelector('.summary > div > div')
      $textContainer.append($linkContainer);
    });
  }

  function fixIcons() {
    document.querySelectorAll('img.icon').forEach(($icon) => {
      // fix up paths for icons that are injected into the doc when using :icon: 
      if($icon.getAttribute('src').indexOf('hlx_statics') === -1){
        $icon.setAttribute('src',  '/hlx_statics' + $icon.getAttribute('src') );
      }
    });
  }


  function later() {
    document.documentElement.classList.add('spectrum','spectrum--light','spectrum--medium');
    loadCSS('/hlx_statics/spectrum/vars/dist/spectrum-global.css');
    loadCSS('/hlx_statics/spectrum/vars/dist/spectrum-medium.css');
    loadCSS('/hlx_statics/spectrum/vars/dist/spectrum-light.css');
    loadCSS('/hlx_statics/spectrum/vars/dist/spectrum-lightest.css');
    loadCSS('/hlx_statics/spectrum/page/dist/index-vars.css');
    loadCSS('/hlx_statics/spectrum/button/dist/index-vars.css');
    loadCSS('/hlx_statics/spectrum/typography/dist/index-vars.css');
    loadCSS('/hlx_statics/spectrum/card/dist/index-vars.css');
    loadCSS('/hlx_statics/spectrum/checkbox/dist/index-vars.css');
    loadCSS('/hlx_statics/spectrum/link/dist/index-vars.css');
    loadCSS('/hlx_statics/spectrum/divider/dist/index-vars.css');
  }

  async function decoratePage() {
    decorateTables();
    wrapSections("main>div");
    decorateBlocks();
    wrapSections("header>div, footer>div");
    decorateFooter();
    decorateButtons();
    //decorateHeader();
    decorateHero();
    // decorateEmbeds();

    // decorateCards();
    // decorateColumns();
    decorateAnnouncement();
    decorateAPIBrowser()
    // decorateResourceCards();
    // decorateSummary();
    // fixIcons();
    later();
  }

  decoratePage();
