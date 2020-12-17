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
            loadCSS(`/styles/blocks/${classes[0]}.css`);
            $block.closest('.section-wrapper').classList.add(`${classes[0]}-container`);
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
  
async function decoratePage() {
    decorateTables();
    wrapSections('main>div');
    decorateHero();
    decorateBlocks();
    wrapSections('header>div, footer>div');
    decorateEmbeds();
    decorateButtons();
    decorateBackgroundImageBlocks();
    decorateColumns();
}

decoratePage();