import {
    createTag,
    addExtraScriptWithLoad
  } from '../../scripts/lib-adobeio.js';

function penpalOnLoad() {
    const createConnection = () => {
        const penpalIframe = document.querySelector('#penpalIframe');
        const connection = window.Penpal.connectToChild({
        // The iframe to which a connection should be made
        iframe: penpalIframe,
        // Manually set origin as auto-detection may fail, as the src of the iframe is set later
        //childOrigin: isExternalLink(src) ? new URL(src).origin : window.origin,
        // Methods the parent is exposing to the child
        methods: {
            scrollTop(position = 0) {
            if (document?.scrollingElement) {
                document.scrollingElement.scrollTop = position;
            }
            },
            getURL() {
            return window?.location?.href;
            },
            setURL(url) {
            if (window?.location) {
                window.location = url;
            }
            },
            setHeight(height) {
            iframe.current.style.height = height;
            },
            getIMSAccessToken() {
            if (window.adobeIMS?.isSignedInUser()) {
                return window.adobeIMS.getAccessToken();
            }

            return null;
            },
            getIMSProfile() {
            if (window.adobeIMS?.isSignedInUser()) {
                return window.adobeIMS.getProfile();
            }

            return null;
            },
            signIn() {
            if (window.adobeIMS && !window.adobeIMS.isSignedInUser()) {
                window.adobeIMS.signIn();
            }
            },
            signOut() {
            if (window.adobeIMS && window.adobeIMS.isSignedInUser()) {
                window.adobeIMS.signOut();
            }
            },
            getIMSClientId() {
            if (window.adobeIMS) {
                return window.adobeIMS.adobeIdData.client_id;
            } else {
                return null;
            }
            }
        }
        });
        return connection;
    };

    if (window.Penpal) {
        const connection = createConnection();
    }
}

/**
 * decorates the iframe
 * @param {Element} block The hero block element
 */
export default async function decorate(block) {
    const iframeSrc = block.querySelector('a');
    const iframeContainer = block.parentElement;
    const iframe = createTag('iframe', { class: 'iframe-container', 'src': iframeSrc.href, 'id': 'penpalIframe' });
    iframeContainer.append(iframe);
    block.remove();
    addExtraScriptWithLoad(document.body, 'https://unpkg.com/penpal@^6/dist/penpal.min.js', penpalOnLoad);
}

