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
        console.log(classes);
        if (classes[0]) {
            loadCSS(`/styles/blocks/${classes[0]}.css`);
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
}
  
function wrapSections(element) {
    document.querySelectorAll(element).forEach(($div) => {
        const $wrapper=createTag('div', { class: 'section-wrapper'});
        $div.parentNode.appendChild($wrapper);
        $wrapper.appendChild($div);
    });
}
  
async function decoratePage() {
    decorateTables();
    wrapSections('main>div');
    decorateBlocks();
    wrapSections('header>div, footer>div');
    decorateButtons();
}

decoratePage();