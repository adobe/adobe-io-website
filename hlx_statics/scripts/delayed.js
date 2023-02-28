// eslint-disable-next-line import/no-cycle
import { sampleRUM } from './lib-helix.js';
import {
  focusRing,
  isHlxPath,
  isStageEnvironment,
  decorateProfile,
  addExtraScript,
  addExtraScriptWithLoad,
  setAnalyticsAttributes
} from './lib-adobeio.js';

async function fetchProfileAvatar(userId) {
  try {
    const req = await fetch(`https://cc-api-behance.adobe.io/v2/users/${userId}?api_key=SUSI2`);
    if (req) {
      const res = await req.json();
      const avatarUrl = res?.user?.images?.['138'] ?? '/hlx_statics/icons/avatar.svg';
      if (document.querySelector('#nav-profile-popover-avatar-img')) {
        document.querySelector('#nav-profile-popover-avatar-img').src = avatarUrl;
      }

      const profileButton = document.querySelector('#nav-profile-dropdown-button');
      if (profileButton.querySelector('svg')) {
        profileButton.querySelector('svg').remove();
      }
      profileButton.innerHTML = `
        <div class="nav-profile-popover-avatar-button">
          <img alt="Avatar" src=${avatarUrl} alt="Profile avatar" />
        </div>
      `;
    }
  } catch (e) {
    // eslint-disable-next-line no-console
    console.warn(e);
  }
}

// Core Web Vitals RUM collection
sampleRUM('cwv');

if (isHlxPath(window.location.host) || isStageEnvironment(window.location.host)) {
  addExtraScript(document.body, 'https://auth-stg1.services.adobe.com/imslib/imslib.js');
} else {
  addExtraScript(document.body, 'https://auth.services.adobe.com/imslib/imslib.min.js');
}

addExtraScript(document.body, 'https://www.adobe.com/marketingtech/main.min.js');
addExtraScript(document.body, 'https://wwwimages2.adobe.com/etc/beagle/public/globalnav/adobe-privacy/latest/privacy.min.js');

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

// only add penpal when we have an iframe penpal present
const penpalIframe = document.querySelector('#penpalIframe');
if (penpalIframe){
  addExtraScriptWithLoad(document.body, 'https://unpkg.com/penpal@^6/dist/penpal.min.js', penpalOnLoad);
}


document.querySelectorAll('.embed').forEach((embed) => {
  const iframe = embed.querySelector('iframe');
  if (!iframe.src) {
    iframe.src = iframe.getAttribute('data-src');
    iframe.onload = () => { iframe.style.opacity = 1; };
  }
});

focusRing();
setAnalyticsAttributes();

if (isHlxPath(window.location.host)) {
  window.adobeid = {
    client_id: 'helix_adobeio',
    scope:
      'AdobeID,openid,read_organizations,additional_info.projectedProductContext,additional_info.roles,gnav,read_pc.dma_bullseye,creative_sdk',
    locale: 'en_US',
    environment: 'stg1',
    useLocalStorage: true,
    logsEnabled: true,
    redirect_uri: window.location.href,
    isSignedIn: false,
    onError: (error) => {
      // eslint-disable-next-line no-console
      console.log(error);
    },
    onReady: () => {
      if (window.adobeIMSMethods.isSignedIn()) {
        window.adobeIMSMethods.getProfile();
      }
    },
  };
  window.marketingtech = {
    adobe: {
      launch: {
        property: 'global',
        environment: 'dev',
      },
      analytics: {
        additionalAccounts: 'pgeo1xxpnwadobeio-qa',
      },
    },
  };
} else if (!isHlxPath(window.location.host) && isStageEnvironment(window.location.host)) {
  window.adobeid = {
    client_id: 'stage_adobe_io',
    scope:
      'AdobeID,openid,unified_dev_portal,read_organizations,additional_info.projectedProductContext,additional_info.roles,gnav,read_pc.dma_bullseye,creative_sdk',
    locale: 'en_US',
    environment: 'stg1',
    useLocalStorage: true,
    logsEnabled: true,
    redirect_uri: window.location.href,
    isSignedIn: false,
    onError: (error) => {
      // eslint-disable-next-line no-console
      console.log(error);
    },
    onReady: () => {
      if (window.adobeIMSMethods.isSignedIn()) {
        window.adobeIMSMethods.getProfile();
      }
    },
  };
  window.marketingtech = {
    adobe: {
      launch: {
        property: 'global',
        environment: 'dev',
      },
      analytics: {
        additionalAccounts: 'pgeo1xxpnwadobeio-qa',
      },
    },
  };
} else if (!isHlxPath(window.location.host) && !isStageEnvironment(window.location.host)) {
  window.adobeid = {
    client_id: 'adobe_io',
    scope:
      'AdobeID,openid,unified_dev_portal,read_organizations,additional_info.projectedProductContext,additional_info.roles,gnav,read_pc.dma_bullseye,creative_sdk',
    locale: 'en_US',
    environment: 'prod',
    useLocalStorage: true,
    logsEnabled: false,
    redirect_uri: window.location.href,
    isSignedIn: false,
    onError: (error) => {
      // eslint-disable-next-line no-console
      console.log(error);
    },
    onReady: () => {
      if (window.adobeIMSMethods.isSignedIn()) {
        window.adobeIMSMethods.getProfile();
      }
    },
  };
  window.marketingtech = {
    adobe: {
      launch: {
        property: 'global',
        environment: 'production',
      },
      analytics: {
        additionalAccounts: 'pgeo1xxpnwadobeio-prod',
      },
    },
  };
}

window.adobeIMSMethods = {
  isSignedIn: () => window.adobeIMS.isSignedInUser(),
  signIn: () => {
    window.adobeIMS.signIn();
  },
  signOut() {
    window.adobeIMS.signOut({});
  },
  getProfile() {
    window.adobeIMS.getProfile().then((profile) => {
      window.adobeid.profile = profile;
      window.adobeid.profile.avatarUrl = '/hlx_statics/icons/avatar.svg';
      decorateProfile(window.adobeid.profile);
      fetchProfileAvatar(window.adobeid.profile.userId);
    })
      .catch((ex) => {
        window.adobeid.profile = ex;
      });
  },
};

// cookie preference
window.fedsConfig = {
  privacy: {
    // TODO config from adobe.com
    otDomainId: '7a5eb705-95ed-4cc4-a11d-0cc5760e93db',
    footerLinkSelector: '#openPrivacy',
  },
};

if (window.adobeImsFactory && window.adobeImsFactory.createIMSLib) {
  window.adobeImsFactory.createIMSLib(window.adobeid);
}

if (window.adobeIMS && window.adobeIMS.initialize) {
  window.adobeIMS.initialize();
}
