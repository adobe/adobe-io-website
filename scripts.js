/**
 * Creates a tag with the given name and attributes.
 * @param {string} name The tag name
 * @param {object} attrs An object containing the attributes
 * @returns The new tag
 */
function createTag(name, attrs) {
    const el = document.createElement(name);
    if (typeof attrs === 'object') {
      for (let [key, value] of Object.entries(attrs)) {
        el.setAttribute(key, value);
      }
    }
    return el;
}

function toClassName(name) {
    return (name.toLowerCase().replace(/[^0-9a-z]/gi, '-'))
  }
  
  
      
/**
 * Loads a CSS file.
 * @param {string} href The path to the CSS file
 */
function loadCSS(href) {
    const link = document.createElement('link');
    link.setAttribute('rel', 'stylesheet');
    link.setAttribute('href', href);
    document.head.appendChild(link);
};


/**
 * Turn tables to DIV.
 * @param {object} $table Table element
 */

function tableToDivs($table) {
    const $rows=$table.querySelectorAll('tbody tr');
    const blockname=$table.querySelector('th').textContent;
    const $block=createTag('div', {class:`${toClassName(blockname)}`});
    $rows.forEach(($tr) => {
        const $row=createTag('div')
        $tr.querySelectorAll('td').forEach(($td, i) => {
        const $div=createTag('div');
            $div.innerHTML=$td.innerHTML;
            $row.append($div);
        });
        $block.append($row);
        });
    return ($block);
}

function decorateTables() {
    document.querySelectorAll('main div>table').forEach(($table) => {
      const $div=tableToDivs($table) 
      $table.parentNode.replaceChild($div, $table);
    });
}
    
function decorateBlocks() {
    document.querySelectorAll('main>div.section-wrapper>div>div').forEach($block => {
        const classes=Array.from($block.classList.values());
        if (classes[0]) {
            if (!classes.includes('embed')) {
              loadCSS(`/styles/blocks/${classes[0]}.css`);
              $block.closest('.section-wrapper').classList.add(`${classes[0]}-container`);  
            }
        }
    })
}

function decorateBackgroundImageBlocks() {
    document.querySelectorAll('main div.background-image').forEach($bgImgDiv => {
      const $images=$bgImgDiv.querySelectorAll('img');
      const $lastImage=$images[$images.length-1];
  
      const $section=$bgImgDiv.closest('.section-wrapper');
      if ($section && $lastImage) {
        $section.style.backgroundImage=`url(${$lastImage.src})`;
        let $caption=$lastImage.nextElementSibling;
        if ($caption) {
          if ($caption.textContent=='') $caption=$caption.nextElementSibling;
          if ($caption) $caption.classList.add('background-image-caption');
        }
        $lastImage.remove();
      } 
    }) 
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
          const $embed=createTag('div', {class: `embed embed-oembed embed-${type}`});
          const $div=$a.closest('div');
          $embed.innerHTML=embedHTML;
          $div.parentElement.replaceChild($embed, $div);
        }  
      }
    })

}
  
function decorateButtons() {
    document.querySelectorAll('main a').forEach($a => {
        const $up=$a.parentElement;
        const $twoup=$a.parentElement.parentElement;
        if ($up.childNodes.length==1 && $up.tagName=='P') {
        $a.className='button secondary';
        }
        if ($up.childNodes.length==1 && $up.tagName=='STRONG' && 
        $twoup.childNodes.length==1 && $twoup.tagName=='P') {
        $a.className='button primary';
        }
    })

    const $consoleButton = document.querySelector('header p:last-child a');
    $consoleButton.className='button secondary';
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
        const $wrapper=createTag('div', { class: 'section-wrapper'});
        $div.parentNode.appendChild($wrapper);
        $wrapper.appendChild($div);
    });
}

function decorateHero() {
  const $heroSection=document.querySelector('main > div');
  const $innerDiv=$heroSection.firstElementChild;
  const $firstChild=$innerDiv.firstElementChild;
  const $heroImg=$firstChild.querySelector('img');
  if ($heroImg) {
    $heroSection.style.backgroundImage=`url('${$heroImg.src}')`;
    $heroImg.remove();
  }
  $heroSection.classList.add('hero');
}

function decorateColumns() {
  document.querySelectorAll('main > .section-wrapper').forEach(($section) => {
    if ($section.className == 'section-wrapper' && ($section.querySelector('p > img[src^="/hlx_"]') || $section.querySelector('div.embed'))) {
      const $columns=createTag('div', {class: 'columns'});
      const $children=Array.from($section.children[0].children);
      let $currentRow;
      let $secondCol=createTag('div');
      $children.forEach(($child) => {

        if (($child.tagName=='P' && $child.querySelector('img[src^="/hlx_"]')) || 
        ($child.tagName=='DIV' && $child.classList.contains('embed'))) {
          if ($currentRow) {
            $currentRow.append($secondCol);
            $columns.append($currentRow);
            $secondCol=createTag('div');
          }
          $currentRow=createTag('div');
          const $firstCol=createTag('div');
          $firstCol.append($child);
          $currentRow.append($firstCol);
        } else {
          $secondCol.append($child);
        }
        if ($currentRow) {
          $currentRow.append($secondCol);
          $columns.append($currentRow);
        }
      })  
      $section.firstChild.append($columns);
      $section.classList.add('columns-container');
      loadCSS(`/styles/blocks/columns.css`);
    }
  })
}

function readBlockConfig($block) {
  const config={};
  $block.querySelectorAll(':scope>div').forEach(($row) => {
    if ($row.children && $row.children[1]) {
      const name=toClassName($row.children[0].textContent);
      const $a=$row.children[1].querySelector('a');
      let value='';
      if ($a) value=$a.href;
      else value=$row.children[1].textContent;
      config[name]=value;  
    }
  });
  return config;
}

function displayFilteredCards(catalog,$cards,buttons,limit,filters) {
  $cards.innerHTML='';
  let counter=0;
  catalog.forEach((card) => {
    let show=true;
    if (filters && filters[0]) {
      if (!filters.includes(card.Category)) show=false;
    }

    if (counter>=limit) show=false;
    if (show) {
      const $card=createTag('div', {class: 'api-card'});
      const icon=card.Icon?`<img class="api-icon" src="/icons/${card.Icon}.svg">`:'';
      let buttonsHtml='';
      buttons.forEach((b,i) => {
        if (card[b]) {
          buttonsHtml+=`<a class="button" href="${card[b]} ${i==(buttons.length-1)?'primary':'secondary'}">${b}</a>`;
        }
      });
      $card.innerHTML=`<div class="api-card-body">
        ${icon}
        <h4>${card.Title}</h4>
        <p>${card.Description}</p>
        </div>
        <div class="api-card-buttons">
          <p>${buttonsHtml}</p>
        </div>          
      `;
      console.log(card);
      $cards.append($card);
      counter++;  
    }
  })
}

function decorateAPIBrowser() {
  document.querySelectorAll('.api-browser').forEach(async $apiBrowser => {
    const config=readBlockConfig($apiBrowser);
    window.aio = window.aio||{};
    const resp=await fetch('/api-catalog.json');
    window.aio.apiCatalog=(await resp.json()).data;
    const catalog=window.aio.apiCatalog;
    let buttons=['Learn More','View Docs'];
    if (config.display) buttons=config.display.split(',').map(e => e.trim());

    $apiBrowser.innerHTML='';
    if (config.filters == "Show") {
      const categories=catalog.map(e => e.Category).filter((v, i, self) => {
        return self.indexOf(v) === i;
      });

      const $cards=createTag('div', {class:'api-cards'});
      const $filters=createTag('div', {class:'filters'});
      $filters.innerHTML=`<strong>Filter by</strong>`;
      categories.forEach((c) => {
        const $filter=createTag('div');
        const id=toClassName(c);
        $filter.innerHTML=`<input type="checkbox" id="${id}" name="${id}" value="${c}">
        <label for="${id}"> ${c}</label><br>`;
        $filter.addEventListener('click', (evt) => {
          const filters=[];
          $filters.querySelectorAll(`:checked`).forEach($cb => filters.push($cb.value));
          displayFilteredCards(catalog, $cards, buttons, config.limit, filters);
        })
        $filters.append($filter);
      })
      $apiBrowser.append($filters);

      $apiBrowser.append($cards);
      displayFilteredCards(catalog, $cards, buttons, config.limit);
    }
  });
}

  
async function decoratePage() {
    decorateTables();
    wrapSections('main>div');
    decorateHero();
    decorateBlocks();
    wrapSections('header>div, footer>div');
    decorateEmbeds();
    decorateIframe();
    decorateButtons();
    decorateBackgroundImageBlocks();
    decorateAPIBrowser()
    decorateColumns();
}

decoratePage(); 