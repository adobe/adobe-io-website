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

document.querySelectorAll('.embed').forEach((embed) => {
  const iframe = embed.querySelector('iframe');
  if (!iframe.src) {
    iframe.src = iframe.getAttribute('data-src');
    iframe.onload = () => { iframe.style.opacity = 1; };
  }
});

focusRing();
setAnalyticsAttributes();

const imsSignIn = new Event('imsSignIn');

// should refactor this if we get more ims clients coming
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
        window.dispatchEvent(imsSignIn);
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

  if (window.location.pathname.includes('/photoshop/api')) {
    window.adobeid = {
      client_id: 'cis_easybake',
      scope:
        'AdobeID,openid,creative_sdk,creative_cloud,unified_dev_portal,read_organizations,additional_info.projectedProductContext,additional_info.roles,gnav,read_pc.dma_bullseye',
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
          window.dispatchEvent(imsSignIn);
          window.adobeIMSMethods.getProfile();
        }
      },
    };
  } else {
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
          window.dispatchEvent(imsSignIn);
          window.adobeIMSMethods.getProfile();
        }
      },
    };
  }
  
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
  if (window.location.pathname.includes('/photoshop/api')) {
    window.adobeid = {
      client_id: 'cis_easybake',
      scope:
        'AdobeID,openid,creative_sdk,creative_cloud,unified_dev_portal,read_organizations,additional_info.projectedProductContext,additional_info.roles,gnav,read_pc.dma_bullseye',
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
          window.dispatchEvent(imsSignIn);
          window.adobeIMSMethods.getProfile();
        }
      },
    };
  } else {
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
          window.dispatchEvent(imsSignIn);
          window.adobeIMSMethods.getProfile();
        }
      },
    };
  }
  
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
