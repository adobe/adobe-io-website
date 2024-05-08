# Adobe I/O Website Helix Repository
This is the Adobe I/O Helix repo. It contains all the scripts, styles and other helixy bits to power the adobe.io website. 

## Installation
1. Install hlx as a global command. You need Node 10.13 or newer. `$ npm install -g @adobe/helix-cli`
3. Run `$ hlx up`
4. Navigate to http://localhost:3000/

## Building styles
The site always uses the minified version of the styles so you must build the styles before seeing them get updated. 
1. `$ npm install --legacy-peer-deps`
2. Make changes to any css file. If you add a new .css files make sure to include them in `styles-includes.css`.
3. `$ npm run buildCss`
4. Minified css built to `/hlx_statics/spectrum/minified`
