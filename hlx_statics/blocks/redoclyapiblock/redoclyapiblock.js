export default function decorate(block) {
  const lib = document.createElement('script');
  lib.setAttribute('src', 'https://cdn.redoc.ly/reference-docs/latest/redocly-reference-docs.min.js');
  document.head.appendChild(lib);

  lib.onload = () => {
    const src = block.querySelector('div')?.querySelector('div')?.innerText;
    const licenseKey = 'eyJ0IjpmYWxzZSwiaSI6MTcwMDE3MjkyNiwiZSI6MTcyNzcyOTQxNywiaCI6WyJyZWRvYy5seSIsImRldmVsb3Blci5hZG9iZS5jb20iLCJkZXZlbG9wZXItc3RhZ2UuYWRvYmUuY29tIl0sInMiOiJwb3J0YWwifQ==.dJE5PglQ5AYR7leagWDa9sMDHPCIe/LIFtg5GSc+Rxc4bLU0ESNJszoMMUr64BnKiJhBcYyTOhKcCWy9csn3og==';

    const div = document.createElement('div');
    div.setAttribute('id', 'redocly_container');
    block.append(div);

    const init = document.createElement('script');
    init.innerHTML = `RedoclyReferenceDocs.init(
          '${src}',
          { licenseKey: '${licenseKey}' },
          document.querySelector('#redocly_container')
        );`;
    block.append(init);
  };
}
