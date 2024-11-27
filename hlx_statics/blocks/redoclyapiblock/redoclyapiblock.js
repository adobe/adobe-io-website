import { createTag, getResourceUrl } from '../../scripts/lib-adobeio.js';

const REDOCLY_LICENSE_KEY = "eyJ0IjpmYWxzZSwiaSI6MTczMjEzNzQzNSwiZSI6MTc1OTI2NTQxNywiaCI6WyJyZWRvYy5seSIsImRldmVsb3Blci5hZG9iZS5jb20iLCJkZXZlbG9wZXItc3RhZ2UuYWRvYmUuY29tIiwiZGV2ZWxvcGVyLmZyYW1lLmlvIiwiZGV2ZWxvcGVyLmRldi5mcmFtZS5pbyIsImxvY2FsaG9zdC5jb3JwLmFkb2JlLmNvbSIsInJlZG9jbHktYXBpLWJsb2NrLS1hZHAtZGV2c2l0ZS0tYWRvYmVkb2NzLmFlbS5wYWdlIiwiZGV2ZWxvcGVyLWRldi5hZG9iZS5jb20iXSwicyI6InBvcnRhbCJ9.gf0tCrK+ApckZEqbuOlYJFlt19NU6UEWpiruC4VIMg9ZYUojkyDGde2aEKpBK2cm57r6yNNFNWHyIRljWAQnsg==";

const DEFAULT_OPTIONS = {
  src: 'https://raw.githubusercontent.com/AdobeDocs/adp-devsite-github-actions-test/refs/heads/main/static/openapi.yaml',
  width: '500px',
  typography: 'fontFamily: `adobe-clean, "Source Sans Pro", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Ubuntu, "Trebuchet MS", "Lucida Grande", sans-serif`',
  codeBlock: 'tokens: { punctuation: { color: "white" }}',
  disableSidebar: false,
  disableSearch: false,
  hideTryItPanel: false,
  scrollYOffset: 0,
  sortOperationsAlphabetically: false,
  sortTagsAlphabetically: false,
  jsonSampleExpandLevel: 2,
  generateCodeSamples: 'languages: [], skipOptionalParameters: false,',
  requestInterceptor: '',
};

const ATTRIBUTE_PREFIX = 'data-';

function parseOptions(block) {
  // start with default options
  const options = Object.assign({}, DEFAULT_OPTIONS);

  const blockChildrenToRemove = [];

  // overwrite with options from user
  block.querySelectorAll('div > div > pre > code').forEach(code => {
    if(code.textContent.startsWith(ATTRIBUTE_PREFIX)){
      let [name, value] = code.textContent.split("=");
      name = name.replace(ATTRIBUTE_PREFIX, '');
      value = value.trim();

      // JSX shorthand for passing true
      if(value === 'undefined') {
        value = true;
      }
      
      options[name] = value;

      // remove attribute row since already been parsed
      blockChildrenToRemove.push(code.parentElement.parentElement.parentElement);
    }
  });

  block.querySelectorAll('div > div > strong').forEach(strong => {
    if(strong.textContent.startsWith(ATTRIBUTE_PREFIX)) {
       // remove comma-separated attributes row as this is redundant with the ones already parsed above
      blockChildrenToRemove.push(strong.parentElement.parentElement);
    } 
  })

  // clear attribute rows
  blockChildrenToRemove.forEach(child => block.removeChild(child));

  return options;
}

export default function decorate(block) {
  const { 
      src,
      width,
      typography,
      codeBlock,
      disableSidebar,
      disableSearch,
      hideTryItPanel,
      scrollYOffset,
      sortOperationsAlphabetically,
      sortTagsAlphabetically,
      jsonSampleExpandLevel,
      generateCodeSamples,
      requestInterceptor,
    } = parseOptions(block);
  
  const absoluteSrc = getResourceUrl(src);

  // https://redocly.com/docs/api-reference-docs/guides/on-premise-html-element#steps
  const redocly_container = createTag('div', {id: 'redocly_container'});
  block.appendChild(redocly_container);

  const redocly = createTag('script', {
      src: 'https://cdn.redoc.ly/reference-docs/latest/redocly-reference-docs.min.js', 
      async: true
    });  

  const console = createTag('script', {
      src: 'https://cdn.redoc.ly/reference-docs/latest/console.redocly-reference-docs.min.js',
      async: true
    });

  document.head.appendChild(redocly);
  document.head.appendChild(console);

  redocly.addEventListener("load", () => {
    const init = createTag('script');
    init.innerHTML = `
      RedoclyReferenceDocs.init(
        '${absoluteSrc}',
        {
          licenseKey: '${REDOCLY_LICENSE_KEY}',
          disableSidebar: ${disableSidebar}, 
          disableSearch: ${disableSearch},
          hideTryItPanel: ${hideTryItPanel},
          scrollYOffset: ${scrollYOffset},
          sortOperationsAlphabetically: ${sortOperationsAlphabetically},
          sortTagsAlphabetically: ${sortTagsAlphabetically},
          jsonSampleExpandLevel: ${jsonSampleExpandLevel === 'all' ? `'${jsonSampleExpandLevel}'` : jsonSampleExpandLevel},
          ${generateCodeSamples ? "generateCodeSamples: { " + generateCodeSamples + "}," : ''}
          ${requestInterceptor ? "requestInterceptor: " + requestInterceptor + "," : ''}
          hideLoading: true,
          theme: {
          ${typography ? "typography: { " + typography + "}," : ''}
          rightPanel: {
            width: '${width}',
            },
            ${codeBlock ? "codeBlock: { " + codeBlock + "}," : ''}
          },
        },
        document.querySelector('#redocly_container')
      );
    `;
    block.appendChild(init);
  });

  redocly.addEventListener("error", (err) => {
    // eslint-disable-next-line no-console
    console.error(err);
  });
}
  