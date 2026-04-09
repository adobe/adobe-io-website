/**
 * Get Credential Block
 * Manages credential creation flow: Sign In → Return → Form → Success Card
 * @param {Element} block The getcredential block element
 */

import { createTag, isLocalHostEnvironment, isStageEnvironment } from "../../scripts/lib-adobeio.js";
import { getMetadata } from "../../scripts/scripts.js";
import { fetchSiteMetadata } from "../../scripts/lib-helix.js";
import {
  createFieldLabel,
  createSpectrumButton,
  createExternalLink,
  createDivider,
  createProjectHeader,
  createCredentialSection,
  createAccessTokenSection,
  createOrgNotice,
  separator,
  showToast,
  downloadZipViaApi,
  createRequestAccessModal,
  createRequestAccessIframeModal,
  createOrganizationModal,
  setRichTextContent
} from "./getcredential-components.js";

// ============================================================================
// IMS READY HELPER
// ============================================================================

/**
 * Waits for IMS to be ready, then calls signIn
 * If IMS is already ready, calls signIn immediately
 */
function waitForIMSAndSignIn() {
  if (window.adp?.imsStatus === 'success' && window.adobeIMS) {
    window.adobeIMS.signIn();
  } else {
    const onIMSReady = () => {
      window.removeEventListener('imsReady', onIMSReady);
      if (window.adobeIMS) {
        window.adobeIMS.signIn();
      }
    };
    window.addEventListener('imsReady', onIMSReady);
  }
}

// ============================================================================
// VALIDATION LOGIC
// ============================================================================

const ALERT_ICON_SVG = '<svg xmlns="http://www.w3.org/2000/svg" height="18" viewBox="0 0 18 18" width="18"><rect id="Canvas" fill="rgb(211, 21, 16)" opacity="0" width="18" height="18"></rect><path fill="rgb(211, 21, 16)" d="M8.5635,1.2895.2,16.256A.5.5,0,0,0,.636,17H17.364a.5.5,0,0,0,.436-.744L9.4365,1.2895a.5.5,0,0,0-.873,0ZM10,14.75a.25.25,0,0,1-.25.25H8.25A.25.25,0,0,1,8,14.75v-1.5A.25.25,0,0,1,8.25,13h1.5a.25.25,0,0,1,.25.25Zm0-3a.25.25,0,0,1-.25.25H8.25A.25.25,0,0,1,8,11.75v-6a.25.25,0,0,1,.25-.25h1.5a.25.25,0,0,1,.25.25Z"></path></svg>';

const domainPattern = /^(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z0-9][a-z0-9-]{0,61}[a-z0-9]$|localhost$/;
const credentialNameRegex = /^(?=[A-Za-z0-9\s]{6,}$)[A-Za-z0-9\s]*$/;

function validateDomain(domainToCheck) {
  if (domainToCheck.includes(':')) {
    const domainsSplit = domainToCheck.split(':');
    if (domainsSplit.length !== 2) {
      return false;
    }

    // Port is only allowed for localhost
    if (domainsSplit[0] !== 'localhost') {
      return false;
    }

    try {
      const port = parseInt(domainsSplit[1]);
      if (!port || port < 1024 || port > 65535) {
        return false;
      }
    } catch (e) {
      return false;
    }

    domainToCheck = domainsSplit[0];
  }
  return domainPattern.test(domainToCheck);
}

function handleAllowedDomainsValidation(value) {
  if (!value || value.trim() === '') {
    return { valid: true, errors: [] };
  }

  const domains = value.split(',');
  const errors = [];

  if (domains.length > 5) {
    errors.push('A maximum of 5 domains are allowed');
  }

  domains.forEach((domain) => {
    let domainToCheck = domain.trim();
    if (domainToCheck.startsWith('*.')) {
      domainToCheck = domainToCheck.substring(2);
    }
    if (!validateDomain(domainToCheck)) {
      errors.push(`Domain ${domain.trim()} is invalid`);
    }
  });

  return { valid: errors.length === 0, errors };
}

function validateCredentialName(value) {
  if (!value || value.trim() === '') {
    return { valid: false, error: '' };
  }

  const isValid = credentialNameRegex.test(value);
  const error = isValid ? '' : 'Credential name must be unique and between 6 and 45 characters long and must not contain any special characters. A project will be automatically created with the same name in Adobe Developer Console.';

  return { valid: isValid, error };
}

// ============================================================================
// FORM STATE MANAGEMENT
// ============================================================================

const formData = {
  CredentialName: '',
  AllowedOrigins: '',
  Downloads: false,
  AdobeDeveloperConsole: false,
  Download: null
};

const validationState = {
  CredentialName: { valid: false, error: '' },
  AllowedOrigins: { valid: true, errors: [] }
};

// Store API response data
let credentialResponse = null;
let templateData = null;
let selectedOrganization = null;
let organizationsData = null;
let lastRequestAccessEntitlement = null;

// Local storage key for organization
const LOCAL_STORAGE_ORG_KEY = 'adobe_selected_organization';

// Form config: used so button state only requires fields that exist in the form
let formHasAllowedOrigins = true;

// ============================================================================
// API FUNCTIONS
// ============================================================================


async function getOrgIdWithFallback(initialOrgId = null) {
  let orgId = initialOrgId || selectedOrganization?.code || selectedOrganization?.id || templateData?.orgId;

  if (!orgId) {
    try {
      if (organizationsData && organizationsData.length > 0) {
        const profile = await window.adobeIMS?.getProfile();
        const accountId = profile?.userId;
        const currentAccountOrgs = organizationsData.filter(o => o.accountId === accountId);
        const defaultOrg = currentAccountOrgs.filter(o => o.default)[0] ?? currentAccountOrgs[0];
        orgId = defaultOrg?.code || defaultOrg?.id;
      }

      // If still no orgId, try to get from IMS profile projectedProductContext
      if (!orgId) {
        const profile = await window.adobeIMS?.getProfile();
        if (profile?.projectedProductContext && profile.projectedProductContext.length > 0) {
          orgId = profile.projectedProductContext[0].prodCtx.owningEntity;
        }
      }
    } catch (error) {
      console.error('[GET ORG ID] Failed to get default orgId:', error);
    }
  }

  return orgId || null;
}

async function createCredential() {
  const token = window.adobeIMS?.getTokenFromStorage()?.token;
  if (!token) {
    console.error('[CREATE CREDENTIAL] User not logged in');
    throw new Error('Please sign in to create credentials');
  }

  if (!templateData) {
    console.error('[CREATE CREDENTIAL] Template data not available');
    throw new Error('Template configuration missing');
  }

  // Prepare APIs data with licenseConfigs from the template response
  const apis = templateData.apis?.map(api => ({
    code: api.code,
    credentialType: api.credentialType,
    flowType: api.flowType,
    licenseConfigs: Array.isArray(api.licenseConfigs) && api.licenseConfigs.length > 0
      ? [{ id: api.licenseConfigs[0].id, productId: api.licenseConfigs[0].productId, op: 'add' }]
      : [],
  })) || [];

  const orgId = await getOrgIdWithFallback();

  if (!orgId) {
    console.error('[CREATE CREDENTIAL] orgId is still undefined after all fallback attempts');
    throw new Error('Please select an organization to create credentials. If you don\'t see any organizations, please contact your administrator to ensure you have access to an organization.');
  }

  const data = {
    projectName: formData.CredentialName,
    description: 'created for get credential',
    metadata: {
      domain: formData.AllowedOrigins,
    },
    orgId: orgId,
    apis,
  };

  const url = `/templates/install/${templateData.id}`;

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
      'x-api-key': window?.adobeIMS?.adobeIdData?.client_id,
      'Accept': 'application/json',
    },
    body: JSON.stringify(data),
  });

  const resResp = await response?.json();
  if (response.ok) {
    return { success: true, data: resResp };
  } else {
    // Parse error message
    let errorMessage = 'Failed to create credential';
    if (resResp.errors && resResp.errors.length > 0) {
      const errorText = resResp.errors[0].message;
      const jsonMatch = errorText.match(/\((\{.*\})\)/);
      if (jsonMatch) {
        const errorDetails = JSON.parse(jsonMatch[1]);
        const rawMessage = errorDetails.messages[0]?.message || errorText;
        const lowerMessage = rawMessage.toLowerCase();
        if (lowerMessage.includes('orgid') && (lowerMessage.includes('undefined') || lowerMessage.includes('required') || lowerMessage.includes('invalid'))) {
          errorMessage = 'Please select an organization to create credentials. Use the "Change organization" link above to select an organization.';
        } else if (lowerMessage.includes('permission') || lowerMessage.includes('not allowed') || lowerMessage.includes('forbidden')) {
          errorMessage = 'You don\'t have permission to create credentials in this organization. Please select a different organization or contact your administrator for access.';
        } else if (lowerMessage.includes('organization') && (lowerMessage.includes('not found') || lowerMessage.includes('invalid'))) {
          errorMessage = 'The selected organization is not available. Please select a different organization using the "Change organization" link above.';
        } else if (lowerMessage.includes('unauthorized') || lowerMessage.includes('401')) {
          errorMessage = 'Your session has expired. Please sign in again and try creating the credential.';
        } else {
          errorMessage = rawMessage.replace(/Expected a string\. Received: undefined/gi, 'Please select an organization')
            .replace(/at: orgId/gi, '')
            .replace(/Invalid value/gi, 'Invalid organization')
            .trim();
        }
      } else {
        const lowerText = errorText.toLowerCase();
        if (lowerText.includes('orgid') && (lowerText.includes('undefined') || lowerText.includes('required'))) {
          errorMessage = 'Please select an organization to create credentials. Use the "Change organization" link above to select an organization.';
        } else if (lowerText.includes('permission') || lowerText.includes('not allowed')) {
          errorMessage = 'You don\'t have permission to create credentials in this organization. Please select a different organization or contact your administrator for access.';
        } else {
          errorMessage = errorText;
        }
      }
    }
    console.error('[CREATE CREDENTIAL] Error:', errorMessage);
    throw new Error(errorMessage);
  }
}

async function fetchExistingCredentials(orgCode) {
  const token = window.adobeIMS?.getTokenFromStorage()?.token;

  if (!token) {
    console.error('[FETCH EXISTING CREDENTIALS] No token available');
    return null;
  }

  // Use selected organization if available
  const selectedOrgCode = orgCode || selectedOrganization?.id;
  const templateId = templateData?.id;

  try {
    // Get user profile for userId
    const profile = await window.adobeIMS?.getProfile();
    const userId = profile?.userId;

    if (!selectedOrgCode || !templateId || !userId) {
      console.error('[FETCH EXISTING CREDENTIALS] Missing required parameters:', { selectedOrgCode, templateId, userId });
      return null;
    }

    // Fetch user's projects/credentials using search endpoint
    const url = `/console/api/organizations/${selectedOrgCode}/search/projects?templateId=${templateId}&createdBy=${userId}&excludeUserProfiles=true&skipReadOnlyCheck=true`;

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
        'x-api-key': window?.adobeIMS?.adobeIdData?.client_id,
      },
    });

    if (response.ok) {
      const data = await response.json();
      return data;
    } else {
      console.error('[FETCH CREDENTIALS] Failed with status:', response.status);
    }
  } catch (error) {
    console.error('[FETCH CREDENTIALS] Error:', error);
  }

  return null;
}

/**
 * Fetch template entitlement for current org (same API as React GetCredential).
 * @returns {Promise<{ userEntitled: boolean, orgEntitled: boolean, disEntitledReasons?: string[], canRequestAccess?: boolean }|null>}
 */
async function fetchTemplateEntitlement() {
  const token = window.adobeIMS?.getTokenFromStorage()?.token;
  const templateId = templateData?.id;
  const orgCode = selectedOrganization?.code || selectedOrganization?.id;
  if (!token || !templateId) return null;
  try {
    const url = `/templates/${templateId}`;
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
      'x-api-key': window?.adobeIMS?.adobeIdData?.client_id,
    };
    if (orgCode) headers['x-org-id'] = orgCode;
    const response = await fetch(url, { method: 'GET', headers });
    if (!response.ok) return null;
    const data = await response.json();
    if (templateData && Array.isArray(data?.apis)) {
      templateData.apis = data.apis;
    }
    const userEntitled = data?.userEntitled !== false;
    const orgEntitled = data?.orgEntitled !== false;
    const disEntitledReasons = data?.disEntitledReasons;
    const canRequestAccess = data?.canRequestAccess;
    return { userEntitled, orgEntitled, disEntitledReasons, canRequestAccess, template: data };
  } catch (e) {
    return null;
  }
}

/**
 * Derive which left-column card to show (same logic as React RestrictedAccess render()).
 * 4 edge cases from config.RequestAccess.components.EdgeCase.components:
 *   Type1User, NotSignUp, NoProduct, NotMember.
 * When template.canRequestAccess === true we show the main RestrictedAccess card (products + Request access button).
 * @param {Object} entitlement - Result from fetchTemplateEntitlement()
 * @param {Object} selectedOrg - selectedOrganization
 * @param {Object} requestAccessConfig - credentialData.RequestAccess
 * @returns {string|null} EdgeCase key ('Type1User'|'NotSignUp'|'NoProduct'|'NotMember') or null for RestrictedAccess card
 */
function getRequestAccessLeftCardKey(entitlement, selectedOrg, requestAccessConfig) {
  if (!entitlement) return null;
  const disEntitledReason = Array.isArray(entitlement.disEntitledReasons) ? entitlement.disEntitledReasons[0] : null;
  const hasType1User = requestAccessConfig?.components?.EdgeCase?.components?.Type1User;

  if (selectedOrg?.type === 'developer' && hasType1User) return 'Type1User';
  if (disEntitledReason === 'USER_MISSING_PUBLIC_BETA') return 'NotSignUp';
  if (disEntitledReason === 'ORG_MISSING_FIS') return 'NoProduct';
  if (entitlement.canRequestAccess === true) return null;
  return 'NotMember';
}

function populateProjectsDropdown(returnContainer, projectsData) {

  const dropdown = returnContainer?.querySelector('.projects-picker');

  // Check if credential fields exist in the DOM
  if (!dropdown) {
    return false;
  }
  // Extract projects array (should include full data with workspaces/credentials)
  // Handle both cases: {projects: [...]} and direct array [...]
  let projects;
  if (Array.isArray(projectsData)) {
    projects = projectsData;
  } else if (projectsData?.projects) {
    projects = projectsData.projects;
  } else {
    projects = [];
  }

  // Clear existing options
  dropdown.innerHTML = '';

  // Populate dropdown with projects (use project ID as value)
  projects.forEach((project, index) => {
    const option = createTag('option', { value: project.id });
    option.textContent = project.title;
    dropdown.appendChild(option);
  });

  // Add onChange handler to dropdown
  dropdown.addEventListener('change', (e) => {
    const selectedProjectId = e.target.value;

    if (!selectedProjectId) {
      return;
    }

    // Find the selected project from the existing projects array (already has full data)
    const selectedProject = projects.find(p => p.id === selectedProjectId);

    if (selectedProject) {
      updateProjectCardDetails(returnContainer, selectedProject);
    }

  });

  if (projects[0]?.id) {
    dropdown.value = projects[0].id;
    updateProjectCardDetails(returnContainer, projects[0]);
  }
  return true;
}

function updateProjectCardDetails(returnContainer, project) {

  if (!returnContainer || !project) {
    return;
  }

  // Extract data (similar to credential card)
  const projectName = project.title || project.name || 'Untitled Project';
  const projectId = project.id;
  const workspace = project.workspaces?.[0];
  const credential = workspace?.credentials?.[0];

  // Extract API Key - try nested structure first, then fallback to flat structure or other properties
  const apiKey = credential?.clientId
    || project.clientId  // Fallback: if clientId is directly on project
    || credential?.id_integration
    || credential?.apiKey
    || credential?.id
    || 'Not available';

  // Extract Allowed Origins - try nested structure first, then fallback to flat structure
  const allowedOrigins = credential?.metadata?.['adobeid.domain']
    || project.metadata?.['adobeid.domain']  // Fallback: if metadata is directly on project
    || credential?.metadata?.adobeid?.domain
    || credential?.metadata?.domain
    || 'Not set';

  const orgName = selectedOrganization?.name || 'Unknown';
  const clientId = credential?.clientId || project.clientId || apiKey;
  const clientSecret = credential?.clientSecret;
  const scopes = credential?.scopes;
  const imsOrgId = selectedOrganization?.code;

  // Update project title
  const projectTitle = returnContainer.querySelector('.project-title');
  if (projectTitle) {
    projectTitle.textContent = projectName;
  }

  // Update project link
  const projectLink = returnContainer.querySelector('.project-link');
  if (projectLink && projectId) {
    const orgId = selectedOrganization?.id || project.org_id;
    const consoleUrl = `/console/projects/${orgId}/${projectId}/overview`;

    projectLink.href = consoleUrl;
    const projectLinkText = projectLink.querySelector('p');
    if (projectLinkText) {
      projectLinkText.textContent = projectName;
    }
  }

  function setReturnField(fieldName, value, isCopyable = true) {
    const el = returnContainer.querySelector(`.return-project-card [data-field="${fieldName}"]`) || returnContainer.querySelector(`[data-field="${fieldName}"]`);
    if (!el || value == null || value === '') return;
    el.textContent = value;
    if (isCopyable && value !== 'Not available' && value !== 'Not set') {
      const copyButton = el.closest('.credential-detail-field')?.querySelector('.copy-button');
      if (copyButton) copyButton.setAttribute('data-copy', value);
    }
  }

  setReturnField('apiKey', apiKey);
  setReturnField('allowedOrigins', allowedOrigins);
  setReturnField('organization', orgName, false);
  setReturnField('clientId', clientId);
  setReturnField('clientSecret', clientSecret);
  setReturnField('scopes', scopes, false);
  setReturnField('imsOrgId', imsOrgId, true);

  // Set data for "Retrieve and copy client secret" API (secrets endpoint)
  const card = returnContainer.querySelector('.return-project-card');
  const credId = credential?.id ?? projectId;
  const orgCode = selectedOrganization?.code ?? selectedOrganization?.id;
  if (card && orgCode && credId) {
    card.dataset.orgCode = orgCode;
    card.dataset.integrationId = String(credId);
  }
}

async function fetchOrganizations() {

  const token = window.adobeIMS?.getTokenFromStorage()?.token;

  if (!token) {
    return null;
  }

  try {
    // Fetch accounts with organizations (matching React component)
    const url = '/console/api/accounts?includeOrganizations=true';

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
        'x-api-key': window?.adobeIMS?.adobeIdData?.client_id,
      },
    });

    if (!response.ok) {
      if (response.status === 401) {
        waitForIMSAndSignIn();
      }
      throw new Error('Could not fetch accounts');
    }

    const accountsResult = await response.json();

    // Extract organizations from accounts
    const organizations = [];
    accountsResult.accounts?.forEach(account => {
      if (account.organizations?.length > 0) {
        account.organizations.forEach(org => {
          organizations.push({
            ...org,
            accountId: account.id,
            accountType: account.type
          });
        });
      }
    });

    // Sort organizations by name
    organizations.sort((a, b) => a.name.localeCompare(b.name));

    return organizations;
  } catch (error) {

    // Fallback: Try to get from IMS profile

    try {
      const profile = await window.adobeIMS?.getProfile();
      const accountId = profile?.userId;

      if (profile?.projectedProductContext) {
        const orgs = profile.projectedProductContext.map((ctx, index) => ({
          code: ctx.prodCtx.owningEntity,
          name: ctx.prodCtx.serviceCode || ctx.prodCtx.owningEntity,
          id: ctx.prodCtx.owningEntity,
          accountId: accountId,
          default: index === 0
        }));

        return orgs;
      }
    } catch (profileError) {
    }
  }

  return null;
}

async function switchOrganization(org) {

  const profile = await window.adobeIMS?.getProfile();
  const accountId = profile?.userId;

  if (!org) {
    // This means it's initial load. Try reading from local storage
    const savedOrgString = localStorage.getItem(LOCAL_STORAGE_ORG_KEY);
    const orgInLocalStorage = savedOrgString ? JSON.parse(savedOrgString) : null;

    // Check if the user has access to the org
    if (orgInLocalStorage) {
      org = organizationsData?.filter(o =>
        o.code === orgInLocalStorage.code && accountId === orgInLocalStorage.accountId
      )[0];
    }

    // If no accessible org found in local storage, we pick the default org
    if (!org) {
      if (orgInLocalStorage) {
        localStorage.removeItem(LOCAL_STORAGE_ORG_KEY);
      }

      if (organizationsData && organizationsData.length > 0) {
        const currentAccountOrgs = organizationsData.filter(o => o.accountId === accountId);

        org = currentAccountOrgs.filter(o => o.default)[0] ?? currentAccountOrgs[0];
      }
    }
  }

  if (!org) {
    throw new Error('No org found to switch to');
  }

  // Switch accounts if org requires account switch
  if (accountId !== org.accountId) {

    await window.adobeIMS?.switchProfile(org.accountId);
  }

  // Set the org in local storage
  localStorage.setItem(LOCAL_STORAGE_ORG_KEY, JSON.stringify(org));
  selectedOrganization = org;
  return org;
}

function clearForm(formContainer) {
  // Clear form data object
  formData.CredentialName = '';
  formData.AllowedOrigins = '';
  formData.AdobeDeveloperConsole = false;
  formData.Downloads = false;

  // Clear form inputs
  const credentialNameInput = formContainer?.querySelector('[data-cy="add-credential-name"]');
  if (credentialNameInput) {
    credentialNameInput.value = '';
    credentialNameInput.classList.remove('error');
  }

  const allowedOriginsInput = formContainer?.querySelector('[data-cy="add-allowed-origins"]');
  if (allowedOriginsInput) {
    allowedOriginsInput.value = '';
    allowedOriginsInput.classList.remove('error');
  }

  // Uncheck checkboxes
  const agreementCheckbox = formContainer?.querySelector('.agreement-checkbox');
  if (agreementCheckbox) agreementCheckbox.checked = false;

  const downloadsCheckbox = formContainer?.querySelector('.downloads-checkbox');
  if (downloadsCheckbox) downloadsCheckbox.checked = false;

  // Reset validation state
  validationState.CredentialName = { valid: false, errors: [] };
  validationState.AllowedOrigins = { valid: true, errors: [] };

  // Clear error messages
  const errorDescriptions = formContainer?.querySelectorAll('.field-description.error');
  errorDescriptions?.forEach(desc => desc.classList.remove('error'));

  // Hide alert icons
  const alertIcons = formContainer?.querySelectorAll('.alert-icon');
  alertIcons?.forEach(icon => icon.style.display = 'none');

  // Reset character counter
  const counter = formContainer?.querySelector('[data-counter="CredentialName"]');
  if (counter) {
    const maxChars = counter.getAttribute('data-max');
    counter.textContent = maxChars;
  }

  // Update button state (should be disabled since form is empty)
  updateButtonState();

}

function updateCredentialCard(cardContainer, responseData) {

  if (!cardContainer || !responseData) return;

  // Integration ID for secrets API: workspaces[0].credentials[0].id or projectId/id
  const integrationId = responseData?.workspaces?.[0]?.credentials?.[0]?.id
    ?? responseData.projectId
    ?? responseData.id;
  const orgCode = selectedOrganization?.code ?? selectedOrganization?.id;
  const card = cardContainer?.querySelector?.('.project-card') || cardContainer;
  if (card && orgCode && integrationId) {
    card.dataset.orgCode = orgCode;
    card.dataset.integrationId = String(integrationId);
  }

  // Extract data: support both API Key (apiKey, allowedOrigins) and OAuth (clientId, clientSecret, scopes, imsOrgId) shapes
  const projectName = formData.CredentialName;
  const projectId = responseData.projectId || responseData.id;
  const apiKey = responseData.apiKey || responseData.clientId;
  const allowedOrigins = formData.AllowedOrigins;
  const orgName = selectedOrganization?.name;
  const clientId = responseData.clientId || responseData.apiKey;
  const clientSecret = responseData.clientSecret;
  const scopes = responseData.scopes;
  const imsOrgId = responseData.imsOrgId || responseData.orgId || selectedOrganization?.code;

  // Update project title
  const projectTitle = cardContainer.querySelector('.project-title');
  if (projectTitle && projectName) {
    projectTitle.textContent = projectName;
  }

  function setFieldValue(fieldName, value, isCopyable = true) {
    const valueEl = cardContainer.querySelector(`[data-field="${fieldName}"]`);
    if (!valueEl || value == null || value === '') return;
    const isValue = valueEl.classList.contains('credential-detail-value');
    valueEl.textContent = value;
    if (isCopyable && value !== 'Not available' && value !== 'Not set') {
      const copyButton = valueEl.closest('.credential-detail-field')?.querySelector('.copy-button')
        || valueEl.parentElement?.querySelector('.copy-button');
      if (copyButton) copyButton.setAttribute('data-copy', value);
    }
  }

  setFieldValue('apiKey', apiKey);
  setFieldValue('allowedOrigins', allowedOrigins);
  setFieldValue('organization', orgName, false);
  setFieldValue('clientId', clientId);
  setFieldValue('clientSecret', clientSecret);
  setFieldValue('scopes', scopes, false);
  setFieldValue('imsOrgId', imsOrgId, true);

  // Update project link if available
  if (projectId && projectName) {
    const projectLink = cardContainer.querySelector('.project-link');
    const orgId = selectedOrganization?.id || responseData.orgId;
    const consoleUrl = `/console/projects/${orgId}/${projectId}/overview`;

    if (projectLink) {
      projectLink.href = consoleUrl;
      const projectLinkText = projectLink.querySelector('p');
      if (projectLinkText) {
        projectLinkText.textContent = projectName;
      } else {
        projectLink.textContent = projectName;
      }
    }
  }
}

function handleInputChange(value, fieldName) {
  formData[fieldName] = value;
  const counter = fieldName === 'CredentialName' && document.querySelector(`[data-counter="${fieldName}"]`);
  if (counter) counter.textContent = parseInt(counter.getAttribute('data-max')) - value.length;

  // Validate and update UI
  if (fieldName === 'CredentialName') {
    const validation = validateCredentialName(value);
    validationState.CredentialName = validation;
    updateFieldValidation('CredentialName', validation);
  } else if (fieldName === 'AllowedOrigins') {
    const validation = handleAllowedDomainsValidation(value);
    validationState.AllowedOrigins = validation;
    updateFieldValidation('AllowedOrigins', validation);
  }

  updateButtonState();
}

function updateFieldValidation(fieldName, validation) {

  const input = document.querySelector(fieldName === 'CredentialName' ?
    '[data-cy="add-credential-name"]' :
    '[data-cy="add-allowed-origins"]');

  if (!input) {
    return;
  }

  const fieldContainer = input.closest('.form-field');
  const descriptionElement = fieldContainer?.querySelector('.field-description');
  const alertIcon = fieldContainer?.querySelector('.alert-icon');

  if (validation.error || validation.errors?.length) {
    // Show error - just change color by adding error class
    input.classList.add('error');
    if (descriptionElement) {
      descriptionElement.classList.add('error');
    }
    // Show alert icon for credential name field
    if (alertIcon && fieldName === 'CredentialName') {
      alertIcon.style.display = 'block';
    }
  } else {
    // Remove error - restore original color
    input.classList.remove('error');
    if (descriptionElement) {
      descriptionElement.classList.remove('error');
    }
    // Hide alert icon
    if (alertIcon && fieldName === 'CredentialName') {
      alertIcon.style.display = 'none';
    }
  }
}

function updateButtonState() {

  const createButton = document.querySelector('.create-button');
  if (!createButton) {
    return;
  }

  const isCredentialNameValid = validationState.CredentialName.valid;
  const isAllowedOriginsValid = !formHasAllowedOrigins || validationState.AllowedOrigins.valid;
  const isCredentialNameFilled = formData.CredentialName.trim() !== '';
  const isAgreementChecked = formData.AdobeDeveloperConsole;

  const shouldDisable = !isCredentialNameFilled || !isCredentialNameValid || !isAllowedOriginsValid || !isAgreementChecked;
  if (shouldDisable) {
    createButton.setAttribute('disabled', 'true');
    createButton.style.opacity = '0.4';
    createButton.style.cursor = 'not-allowed';
  } else {
    createButton.removeAttribute('disabled');
    createButton.style.opacity = '1';
    createButton.style.cursor = 'pointer';
  }
}

// ============================================================================
// FORM FIELD HELPER
// ============================================================================

function addDescription(container, text) {
  if (text) {
    const desc = createTag('p', { class: 'spectrum-Body spectrum-Body--sizeXS field-description' });
    desc.textContent = text;
    container.appendChild(desc);
  }
}

// ============================================================================
// FORM FIELD COMPONENTS
// ============================================================================

function createCredentialNameField(config) {
  const fieldContainer = createTag('div', { class: 'form-field' });
  const labelSection = createTag('div', { class: 'spectrum-Textfield spectrum-Textfield--sizeM field-header' });

  config.required = true;
  labelSection.appendChild(createFieldLabel(config, 'CredentialName'));

  if (config.range) {
    const charCount = createTag('span', {
      class: 'spectrum-Textfield-characterCount',
      'data-counter': 'CredentialName',
      'data-max': config.range
    });
    charCount.textContent = config.range;
    labelSection.appendChild(charCount);
  }

  fieldContainer.appendChild(labelSection);

  // Input wrapper for positioning alert icon
  const inputWrapper = createTag('div', { class: 'input-wrapper' });

  const input = createTag('input', {
    type: 'text',
    class: 'credential-input',
    placeholder: config.placeholder || '',
    maxlength: config.range || '',
    'data-cy': 'add-credential-name',
    required: true
  });
  input.addEventListener('input', (e) => handleInputChange(e.target.value, 'CredentialName'));
  inputWrapper.appendChild(input);

  // Alert icon (hidden by default)
  const alertIcon = createTag('span', {
    class: 'alert-icon',
    'data-field': 'CredentialName'
  });
  alertIcon.innerHTML = ALERT_ICON_SVG;
  alertIcon.style.display = 'none';
  inputWrapper.appendChild(alertIcon);

  fieldContainer.appendChild(inputWrapper);
  addDescription(fieldContainer, config.description);

  return fieldContainer;
}

function createAllowedOriginsField(config) {
  const fieldContainer = createTag('div', { class: 'form-field' });
  const labelSection = createTag('div', { class: 'spectrum-Textfield spectrum-Textfield--sizeM field-header' });

  labelSection.appendChild(createFieldLabel(config, 'AllowedOrigins'));
  fieldContainer.appendChild(labelSection);

  const textarea = createTag('textarea', {
    class: 'origins-textarea',
    placeholder: config.placeholder || '',
    'data-cy': 'add-allowed-origins'
  });
  textarea.addEventListener('input', (e) => handleInputChange(e.target.value, 'AllowedOrigins'));
  fieldContainer.appendChild(textarea);
  addDescription(fieldContainer, config.description);

  return fieldContainer;
}

function createDownloadsField(config) {
  const fieldContainer = createTag('div', { class: 'form-field downloads-field' });
  const checkboxWrapper = createTag('div', { class: 'checkbox-wrapper' });

  const checkbox = createTag('input', {
    type: 'checkbox',
    class: 'downloads-checkbox',
    'data-cy': 'download-checkBox',
    id: 'downloads-checkbox'
  });

  checkbox.addEventListener('change', (e) => {
    handleInputChange(e.target.checked, 'Downloads');
    const downloadOptions = fieldContainer.querySelector('.download-options');
    const languageSection = fieldContainer.querySelector('.language-section');
    if (downloadOptions) downloadOptions.style.display = e.target.checked ? 'flex' : 'none';
    if (languageSection) languageSection.style.display = e.target.checked ? 'block' : 'none';
  });

  checkboxWrapper.appendChild(checkbox);
  checkboxWrapper.appendChild(createFieldLabel(config, 'downloads-checkbox', true));
  fieldContainer.appendChild(checkboxWrapper);

  // Set default download based on number of options
  if (config.items && config.items.length > 0) {
    const firstDownload = config.items[0].Download;
    formData.Download = firstDownload;
  }

  if (config.items?.length > 1) {
    const downloadOptions = createTag('div', { class: 'download-options', style: 'display: none;' });
    const downloadOptionsLabel = createTag('label', { class: 'spectrum-Body spectrum-Body--sizeS field-label' });
    downloadOptionsLabel.textContent = 'Language';
    downloadOptions.appendChild(downloadOptionsLabel);
    const downloadOptionsList = createTag('select', {
      class: 'download-options-list',
      'data-cy': 'download-options-list'
    });

    // Populate dropdown with download options
    config.items.forEach((item, index) => {
      const download = item.Download;
      const option = createTag('option', {
        value: download.href,
        'data-index': index
      });
      option.textContent = download.title;
      if (index === 0) {
        option.selected = true;
      }
      downloadOptionsList.appendChild(option);
    });

    // Handle dropdown change
    downloadOptionsList.addEventListener('change', (e) => {
      const selectedIndex = e.target.options[e.target.selectedIndex].getAttribute('data-index');
      formData.Download = config.items[selectedIndex].Download;
    });

    downloadOptions.appendChild(downloadOptionsList);
    fieldContainer.appendChild(downloadOptions);

    // Add Language field if languages are provided
    if (config.languages?.length) {
      const languageSection = createTag('div', { class: 'language-section', style: 'display: none;' });

      const languageLabel = createTag('label', { class: 'spectrum-Body spectrum-Body--sizeS field-label' });
      languageLabel.textContent = 'Language';
      languageSection.appendChild(languageLabel);

      // If only one language, show as plain text
      if (config.languages.length === 1) {
        const languageText = createTag('div', { class: 'language-text' });
        languageText.textContent = config.languages[0];
        formData.Language = config.languages[0];
        languageSection.appendChild(languageText);
      } else {
        // If multiple languages, show as dropdown
        const languageDropdown = createTag('select', {
          class: 'language-dropdown',
          'data-cy': 'language-dropdown'
        });

        config.languages.forEach((language, index) => {
          const option = createTag('option', { value: language });
          option.textContent = language;
          if (index === 0) option.selected = true;
          languageDropdown.appendChild(option);
        });

        languageDropdown.addEventListener('change', (e) => {
          formData.Language = e.target.value;
        });

        // Set initial value
        formData.Language = config.languages[0];

        languageSection.appendChild(languageDropdown);
      }

      fieldContainer.appendChild(languageSection);
    }
  }

  return fieldContainer;
}

function createProductsField(config) {
  const fieldContainer = createTag('div', { class: 'form-field products-field' });

  if (config.label) {
    const label = createTag('label', { class: 'spectrum-Body spectrum-Body--sizeS field-label' });
    setRichTextContent(label, config.label);
    fieldContainer.appendChild(label);
  }

  const productsList = createTag('div', { class: 'products-list' });

  config.items?.forEach(item => {
    const product = item.Product;
    const productItem = createTag('div', { class: 'product-item' });

    if (product.icon) {
      productItem.appendChild(createTag('img', { class: `product-icon icon`, src: product.icon }));
    }

    const productLabel = createTag('span', { class: 'product-label' });
    setRichTextContent(productLabel, product.label);
    productItem.appendChild(productLabel);
    productsList.appendChild(productItem);
  });

  fieldContainer.appendChild(productsList);
  return fieldContainer;
}

function createAgreementField(config) {
  const fieldContainer = createTag('div', { class: 'form-field agreement-field' });
  const checkboxWrapper = createTag('div', { class: 'checkbox-wrapper' });

  const checkbox = createTag('input', { type: 'checkbox', class: 'agreement-checkbox' });
  checkbox.addEventListener('change', (e) => handleInputChange(e.target.checked, 'AdobeDeveloperConsole'));

  const labelText = createTag('span', { class: 'agreement-text' });
  setRichTextContent(labelText, (config.label || '') + ' ');

  const link = createTag('a', { href: config.href, target: '_blank', class: 'agreement-link' });
  setRichTextContent(link, config.linkText);
  labelText.appendChild(link);

  checkboxWrapper.appendChild(checkbox);
  checkboxWrapper.appendChild(labelText);
  fieldContainer.appendChild(checkboxWrapper);

  return fieldContainer;
}

function createSideContent(config) {
  const sideContainer = createTag('div', { class: 'side-content' });
  if (!config?.content?.elements) return sideContainer;
  const style = config.content.style;
  if (style) Object.assign(sideContainer.style, style);
  config.content.elements.forEach(element => {
    const el = createTag(element.type, { class: element.className || '' });
    if (element.style) Object.assign(el.style, element.style);
    if (element.href) el.href = element.href;
    setRichTextContent(el, element.text);
    sideContainer.appendChild(el);
  });
  return sideContainer;
}

/**
 * Build the left-column card for Request Access: either RestrictedAccess (products + Request access button)
 * or an EdgeCase variant (title, optional description, optional "Change organization?" link, outline button).
 * @param {Object} [options] - Optional: { selectedOrganization, userEmail } for org message and description placeholder
 */
function buildRequestAccessLeftCard(config, edgeCaseKey, options = {}) {
  const edgeCases = config.components?.EdgeCase?.components;
  const edgeCase = edgeCaseKey && edgeCases?.[edgeCaseKey];
  if (edgeCase) {
    return buildEdgeCaseCard(config, edgeCaseKey, options);
  }
  const restricted = config.components?.RestrictedAccess;
  if (!restricted) return null;
  const card = createTag('div', { class: 'request-access-restricted-card' });
  if (restricted.title) {
    const titleRow = createTag('div', { class: 'request-access-restricted-title-row' });
    const cardTitle = createTag('h3', { class: 'spectrum-Heading spectrum-Heading--sizeS request-access-restricted-title' });
    setRichTextContent(cardTitle, restricted.title);
    titleRow.appendChild(cardTitle);
    const infoIcon = createTag('span', { class: 'request-access-restricted-info-icon', 'aria-label': 'Information' });
    infoIcon.innerHTML = '<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="8" cy="8" r="7.5" stroke="currentColor" stroke-width="1"/><path d="M8 7v4M8 5v.5" stroke="currentColor" stroke-width="1.2" stroke-linecap="round"/></svg>';
    titleRow.appendChild(infoIcon);
    card.appendChild(titleRow);
  }
  const orgName = selectedOrganization?.name || selectedOrganization?.code || 'this organization';
  const introPara = createTag('p', { class: 'spectrum-Body spectrum-Body--sizeS request-access-restricted-intro' });
  introPara.innerHTML = `You're creating this credential in <strong>[${orgName}]</strong> but you do not have a developer access in this organization and need admin approval to use this API. <a href="#" class="request-access-change-org-link">Change organization?</a>`;
  card.appendChild(introPara);
  const products = restricted.components?.Products;
  if (products?.label) {
    const productsLabel = createTag('p', { class: 'spectrum-Body spectrum-Body--sizeS request-access-products-label' });
    setRichTextContent(productsLabel, products.label);
    card.appendChild(productsLabel);
  }
  if (products?.items?.length) {
    const list = createTag('div', { class: 'request-access-products-list' });
    products.items.forEach((item) => {
      const product = item?.Product || item;
      const row = createTag('div', { class: 'request-access-product-item' });
      if (product.icon) {
        const img = createTag('img', { class: 'request-access-product-icon', src: product.icon, alt: '' });
        row.appendChild(img);
      }
      const label = createTag('span', { class: 'request-access-product-label' });
      setRichTextContent(label, product?.label || '');
      row.appendChild(label);
      list.appendChild(row);
    });
    card.appendChild(list);
  }
  if (restricted.buttonLabel) {
    const isRequestPending = Boolean(lastRequestAccessEntitlement?.template?.isRequestPending);
    const btnWrap = createTag('div', { class: 'request-access-request-btn-wrap' });
    const btn = createTag('button', {
      type: 'button',
      class: 'spectrum-Button spectrum-Button--fill spectrum-Button--accent spectrum-Button--sizeM request-access-request-btn'
    });
    btn.innerHTML = `<span class="spectrum-Button-label">${restricted.buttonLabel}</span>`;
    btn.disabled = isRequestPending;
    if (isRequestPending) {
      btn.classList.add('request-access-request-btn--disabled');
      btn.setAttribute('aria-disabled', 'true');
      btn.setAttribute('aria-label', 'Request access is pending, please wait for approval');
      btn.removeAttribute('data-request-access-trigger');
      btn.removeClassName('spectrum-Button--fill');
      const pendingPopover = createTag('div', {
        class: 'request-access-pending-popover hidden',
        role: 'status',
        'aria-live': 'polite'
      });
      const pendingTitle = createTag('p', { class: 'request-access-pending-title' });
      setRichTextContent(pendingTitle, 'Your request is pending approval');
      const pendingBody = createTag('p', { class: 'request-access-pending-body' });
      setRichTextContent(pendingBody, "You'll hear back from your admin soon. If your request is approved, you'll get an email with instructions on how to start using your apps and services.");
      const pendingLink = createTag('a', {
        class: 'request-access-pending-link',
        href: 'https://developer.adobe.com/developer-console/docs/guides/credentials/request-access/',
        target: '_blank',
        rel: 'noreferrer'
      });
      pendingLink.textContent = 'Learn more about requesting Adobe apps';
      pendingPopover.appendChild(pendingTitle);
      pendingPopover.appendChild(pendingBody);
      pendingPopover.appendChild(pendingLink);

      const pendingInfoTrigger = createTag('button', {
        type: 'button',
        class: 'request-access-pending-info-trigger',
        'aria-label': 'Show pending request details'
      });
      pendingInfoTrigger.innerHTML = '<svg width="14" height="14" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="8" cy="8" r="7.5" stroke="currentColor"/><path d="M8 7v4M8 5v.5" stroke="currentColor" stroke-width="1.2" stroke-linecap="round"/></svg>';

      const showPendingPopover = () => pendingPopover.classList.remove('hidden');
      const hidePendingPopover = () => pendingPopover.classList.add('hidden');
      pendingInfoTrigger.addEventListener('mouseenter', showPendingPopover);
      pendingInfoTrigger.addEventListener('mouseleave', hidePendingPopover);
      pendingInfoTrigger.addEventListener('focus', showPendingPopover);
      pendingInfoTrigger.addEventListener('blur', hidePendingPopover);
      pendingInfoTrigger.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        pendingPopover.classList.toggle('hidden');
      });
      btnWrap.appendChild(btn);
      btnWrap.appendChild(pendingInfoTrigger);
      btnWrap.appendChild(pendingPopover);
    } else {
      btn.setAttribute('aria-disabled', 'false');
      btn.setAttribute('aria-label', 'Request access');
      btn.setAttribute('data-request-access-trigger', 'true');
      btnWrap.appendChild(btn);
    }
    card.appendChild(btnWrap);
  }
  return card;
}

function buildEdgeCaseCard(config, edgeCaseKey, options = {}) {
  const { userEmail, selectedOrganization } = options;
  const edgeCases = config.components?.EdgeCase?.components;
  const edgeCase = edgeCaseKey && edgeCases?.[edgeCaseKey];
  if (!edgeCase) return null;
  const productsLabel = config.components?.RestrictedAccess?.components?.Products?.label || 'this service';
  const accountLabel = userEmail || 'this account';
  const orgLabel = selectedOrganization?.type === 'developer'
    ? 'your personal developer organization'
    : (selectedOrganization?.name || 'this organization');
  const card = createTag('div', { class: 'request-access-edge-case-card' });
  if (edgeCase.title) {
    const titleRow = createTag('div', { class: 'request-access-edge-case-title-row' });
    const titleEl = createTag('h3', { class: 'spectrum-Heading spectrum-Heading--sizeS request-access-edge-case-title' });
    setRichTextContent(titleEl, edgeCase.title);
    titleRow.appendChild(titleEl);
    const infoIcon = createTag('span', { class: 'request-access-edge-case-info-icon', 'aria-label': 'Information' });
    infoIcon.innerHTML = '<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="8" cy="8" r="7.5" stroke="currentColor" stroke-width="1"/><path d="M8 7v4M8 5v.5" stroke="currentColor" stroke-width="1.2" stroke-linecap="round"/></svg>';
    titleRow.appendChild(infoIcon);
    card.appendChild(titleRow);
  }
  const defaultDescriptions = {
    Type1User: `You are currently signed in with ${accountLabel} and cannot access ${productsLabel} APIs.`,
    NotMember: `You are currently signed in with ${accountLabel} in ${orgLabel} and cannot access ${productsLabel} APIs.`,
    NotSignUp: `You are currently signed in with ${accountLabel} and cannot access ${productsLabel} APIs.`,
    NoProduct: `Your organization does not have access to ${productsLabel}. Contact your admin or change organization.`
  };
  const showChangeOrg = edgeCase.showChangeOrgLink !== false && (['Type1User', 'NotMember', 'NotSignUp', 'NoProduct'].includes(edgeCaseKey) || edgeCase.showChangeOrgLink);
  const defaultDescription = defaultDescriptions[edgeCaseKey] || '';
  const descriptionText = edgeCase.description || defaultDescription;
  if (descriptionText) {
    const descEl = createTag('p', { class: 'spectrum-Body spectrum-Body--sizeS request-access-edge-case-description' });
    setRichTextContent(descEl, descriptionText);
    if (showChangeOrg) {
      descEl.appendChild(document.createTextNode(' '));
      const changeOrgWrap = createTag('span', { class: 'request-access-edge-case-change-org-wrap' });
      const changeOrgLink = createTag('a', { href: '#', class: 'request-access-change-org-link' });
      changeOrgLink.textContent = 'Change organization?';
      changeOrgWrap.appendChild(changeOrgLink);
      descEl.appendChild(changeOrgWrap);
    }
    card.appendChild(descEl);
  }
  if (edgeCase.buttonLabel) {
    const link = createTag('a', {
      href: edgeCase.buttonLink || '#',
      class: 'spectrum-Button spectrum-Button--outline spectrum-Button--secondary spectrum-Button--sizeM request-access-edge-case-btn'
    });
    link.innerHTML = `<span class="spectrum-Button-label">${edgeCase.buttonLabel}</span>`;
    if (edgeCase.buttonLink) {
      link.setAttribute('target', '_blank');
      link.setAttribute('rel', 'noreferrer');
    }
    card.appendChild(link);
  }
  return card;
}


/**
 * Update the Request Access left column to show RestrictedAccess or the given EdgeCase variant.
 * @param {Object} [options] - Optional: { selectedOrganization } for restricted card org message
 */
function updateRequestAccessLeftColumn(container, requestAccessConfig, edgeCaseKey, options = {}) {
  const leftCol = container?.querySelector('.request-access-left');
  if (!leftCol || !requestAccessConfig) return;
  const slot = leftCol.querySelector('.request-access-left-slot');
  if (!slot) return;
  const card = buildRequestAccessLeftCard(requestAccessConfig, edgeCaseKey, options);
  if (card) {
    slot.innerHTML = '';
    slot.appendChild(card);
  }
}

/**
 * Build Request Access page from config (title, paragraph, left card from RestrictedAccess or EdgeCase + RequestAccessSide).
 * Config is read from credential JSON: GetCredential.components.RequestAccess.
 */
function createRequestAccessContent(config) {
  const wrapper = createTag('div', { class: 'request-access-wrapper' });
  const contentWrapper = createTag('div', { class: 'request-access-content-wrapper' });

  const header = createTag('div', { class: 'request-access-header' });
  if (config.title) {
    const titleEl = createTag('h2', { class: 'spectrum-Heading spectrum-Heading--sizeXL request-access-title' });
    setRichTextContent(titleEl, config.title);
    header.appendChild(titleEl);
  }
  if (config.paragraph) {
    const para = createTag('p', { class: 'spectrum-Body spectrum-Body--sizeL request-access-paragraph' });
    setRichTextContent(para, config.paragraph);
    header.appendChild(para);
  }
  contentWrapper.appendChild(header);

  const columns = createTag('div', { class: 'request-access-columns' });
  const leftCol = createTag('div', { class: 'request-access-left' });
  const slot = createTag('div', { class: 'request-access-left-slot' });

  const defaultCard = buildRequestAccessLeftCard(config, null);
  if (defaultCard) slot.appendChild(defaultCard);
  leftCol.appendChild(slot);
  columns.appendChild(leftCol);
  const side = config.components?.RequestAccessSide;
  if (side?.content) {
    const divider = separator();
    const rightCol = createTag('div', { class: 'request-access-right' });
    columns.appendChild(divider);
    rightCol.appendChild(createSideContent(side));
    columns.appendChild(rightCol);
  }
  contentWrapper.appendChild(columns);
  wrapper.appendChild(contentWrapper);
  return wrapper;
}

// ============================================================================
// SIGN IN PAGE
// ============================================================================

function createSignInContent(config) {
  const signInWrapper = createTag('div', { class: 'sign-in-wrapper' });

  if (config.title) {
    const title = createTag('h2', { class: 'spectrum-Heading spectrum-Heading--sizeXL sign-in-title' });
    setRichTextContent(title, config.title);
    signInWrapper.appendChild(title);
  }

  if (config.paragraph) {
    const paragraph = createTag('p', { class: 'spectrum-Body spectrum-Body--sizeL sign-in-description' });
    setRichTextContent(paragraph, config.paragraph);
    signInWrapper.appendChild(paragraph);
  }

  const button = createSpectrumButton('Sign in to create credentials', 'outline', 'M');
  button.classList.add('sign-in-button');
  button.setAttribute('data-cy', 'sign-in-button');
  signInWrapper.appendChild(button);

  return signInWrapper;
}

const ensureSignedInContextAndOrganizations = async () => {
  if (!window.adobeIMS?.isSignedInUser?.()) return;
  if (organizationsData && organizationsData.length > 0 && selectedOrganization) return;
  try {
    const orgs = await fetchOrganizations();
    if (orgs && orgs.length > 0) {
      organizationsData = orgs;
      await switchOrganization(null);
    }
  } catch (e) {
    // Keep existing fallback org selection when org fetch fails.
  }
};

// ============================================================================
// RETURN PAGE (Previously Created Projects)
// ============================================================================
function createReturnContent(config, handleReturnOrgChange) {
  const returnWrapper = createTag('div', { class: 'return-wrapper' });

  const contentWrapper = createTag('div', { class: 'return-content-wrapper' });

  // Left side - "Get credentials" content
  const leftContent = createTag('div', { class: 'return-left-content' });

  // Get credentials header
  const getCredHeader = createTag('div', { class: 'get-cred-header' });
  const getCredTitle = createTag('h2', { class: 'spectrum-Heading spectrum-Heading--sizeXL' });
  getCredTitle.textContent = 'Get credentials';
  getCredHeader.appendChild(getCredTitle);

  const getCredDesc = createTag('p', { class: 'spectrum-Body spectrum-Body--sizeL' });
  getCredDesc.textContent = 'Create unique credentials that you will use to call Adobe Express Embed SDK from your application.';
  getCredHeader.appendChild(getCredDesc);

  // Organization notice
  getCredHeader.appendChild(createOrgNotice(
    `You're viewing in ${selectedOrganization?.type === "developer" ? 'your personal developer organization' : selectedOrganization?.name}  `,
    'org-notice-return',
    organizationsData,
    selectedOrganization,
    handleReturnOrgChange,
    () => selectedOrganization
  ));

  leftContent.appendChild(getCredHeader);

  // Side content (Welcome back + Need another credential)
  if (config.components?.Side) {
    if (config.components.Side.components?.Custom) {
      const customContent = config.components.Side.components.Custom.content;
      const customWrapper = createTag('div', { class: 'return-custom-wrapper' });
      if (customContent.style) Object.assign(customWrapper.style, customContent.style);

      customContent.elements?.forEach(element => {
        const el = createTag(element.type, { class: element.className || '' });
        setRichTextContent(el, element.text);
        customWrapper.appendChild(el);
      });

      leftContent.appendChild(customWrapper);
    }

    if (config.components.Side.components?.NewCredential) {
      const newCredSection = createTag('div', { class: 'new-credential-section' });
      const heading = createTag('h3', { class: 'spectrum-Heading spectrum-Heading--sizeS' });
      setRichTextContent(heading, config.components.Side.components.NewCredential.heading);
      newCredSection.appendChild(heading);

      const button = createSpectrumButton(config.components.Side.components.NewCredential.buttonLabel, 'accent', 'M');
      button.classList.add('create-new-button');
      newCredSection.appendChild(button);

      leftContent.appendChild(newCredSection);
    }
  }

  contentWrapper.appendChild(leftContent);

  const divider = separator();
  contentWrapper.appendChild(divider);

  // Right side - "Previously created projects" content
  const rightContent = createTag('div', { class: 'return-right-content' });

  // Title and paragraph
  if (config.title) {
    const title = createTag('h2', { class: 'spectrum-Heading spectrum-Heading--sizeXL return-title' });
    setRichTextContent(title, config.title);
    rightContent.appendChild(title);
  }

  if (config.paragraph) {
    const paragraph = createTag('p', { class: 'spectrum-Body spectrum-Body--sizeL return-description' });
    setRichTextContent(paragraph, config.paragraph);
    rightContent.appendChild(paragraph);
  }

  // Manage Developer Console link
  if (config.components?.ManageDeveloperConsole) {
    const manageConsoleLink = createExternalLink(
      config.components.ManageDeveloperConsole.label,
      config.components.ManageDeveloperConsole.direction
    );
    manageConsoleLink.classList.remove('project-link');
    manageConsoleLink.classList.add('manage-console-link');
    rightContent.appendChild(manageConsoleLink);
  }

  // Projects Dropdown (will be populated dynamically)
  if (config.components?.ProjectsDropdown) {
    const dropdownSection = createTag('div', { class: 'projects-dropdown-section' });
    const dropdownLabel = createTag('label', { class: 'spectrum-Body spectrum-Body--sizeS' });
    setRichTextContent(dropdownLabel, config.components.ProjectsDropdown.label);
    dropdownSection.appendChild(dropdownLabel);

    // Create empty dropdown - will be populated by populateProjectsDropdown()
    const dropdown = createTag('select', { class: 'spectrum-Picker projects-picker' });
    dropdownSection.appendChild(dropdown);

    if (config.components.ProjectsDropdown.subHeading) {
      const subHeading = createTag('p', { class: 'spectrum-Body spectrum-Body--sizeXS dropdown-subheading' });
      setRichTextContent(subHeading, config.components.ProjectsDropdown.subHeading);
      dropdownSection.appendChild(subHeading);
    }

    rightContent.appendChild(dropdownSection);
  }

  // Project Card (will be populated dynamically)
  const isCollapsable = config.isCollapsable === 'true' || config.isCollapsable === true;
  const projectCard = createTag('div', { class: `return-project-card${isCollapsable ? ' collapsed' : ''}` });
  const projectHeader = createProjectHeader('', config.components?.Products, isCollapsable);
  projectCard.appendChild(projectHeader);

  // Collapsible content wrapper
  const cardContent = createTag('div', { class: 'card-collapsible-content' });

  // Divider
  cardContent.appendChild(createDivider());

  // Card sections driven by JSON config (only sections present in config are shown)
  const cardSectionOrder = ['AccessToken', 'DevConsoleLink', 'CredentialDetails'];
  cardSectionOrder.forEach((key) => {
    if (!config.components?.[key]) return;
    if (key === 'AccessToken') {
      cardContent.appendChild(createAccessTokenSection(config.components.AccessToken));
    } else if (key === 'DevConsoleLink') {
      const devConsoleSection = createTag('div', { class: 'dev-console-section' });
      const devConsoleLabel = createTag('h3', { class: 'section-label spectrum-Heading spectrum-Heading--sizeS' });
      setRichTextContent(devConsoleLabel, config.components.DevConsoleLink.heading);
      devConsoleSection.appendChild(devConsoleLabel);
      const projectLink = createExternalLink('', '#');
      devConsoleSection.appendChild(projectLink);
      cardContent.appendChild(devConsoleSection);
    } else if (key === 'CredentialDetails') {
      cardContent.appendChild(createCredentialSection(config.components.CredentialDetails));
    }
  });

  // Next steps button
  if (config.nextStepsLabel && config.nextStepsHref) {
    const buttonsSection = createTag('div', { class: 'card-buttons' });
    const nextStepsButton = createTag('a', {
      class: 'spectrum-Button spectrum-Button--outline spectrum-Button--primary spectrum-Button--sizeM',
      href: config.nextStepsHref
    });
    nextStepsButton.innerHTML = `<span class="spectrum-Button-label">${config.nextStepsLabel}</span>`;
    buttonsSection.appendChild(nextStepsButton);
    cardContent.appendChild(buttonsSection);
  }

  projectCard.appendChild(cardContent);

  // Toggle collapse on arrow click (only if collapsable)
  if (isCollapsable) {
    const arrowIcon = projectHeader.querySelector('.project-arrow');
    if (arrowIcon) {
      arrowIcon.addEventListener('click', () => {
        projectCard.classList.toggle('collapsed');
      });
    }
  }

  rightContent.appendChild(projectCard);
  contentWrapper.appendChild(rightContent);

  returnWrapper.appendChild(contentWrapper);
  return returnWrapper;
}

// ============================================================================
// LOADING PAGE
// ============================================================================

function createLoadingPage() {
  const loadingContainer = createTag('div', { class: 'loading-container hidden' });

  const loadingContent = createTag('div', { class: 'loading-content' });

  // Pure CSS/SVG Progress Circle
  const progressWrapper = createTag('div', { class: 'loading-progress' });
  progressWrapper.innerHTML = `
    <svg class="progress-circle-svg" viewBox="0 0 64 64" role="progressbar" aria-label="Loading">
      <circle class="progress-circle-track" cx="32" cy="32" r="28"></circle>
      <circle class="progress-circle-fill" cx="32" cy="32" r="28"></circle>
    </svg>
  `;
  loadingContent.appendChild(progressWrapper);

  // Loading text (will be updated dynamically)
  const loadingText = createTag('div', { class: 'loading-text' });
  loadingText.textContent = 'Loading...';
  loadingContent.appendChild(loadingText);

  loadingContainer.appendChild(loadingContent);

  // Store reference to text element for updates
  loadingContainer._textElement = loadingText;

  return loadingContainer;
}

// Helper function to update loading text
function setLoadingText(loadingContainer, text) {
  if (loadingContainer && loadingContainer._textElement) {
    loadingContainer._textElement.textContent = text;
  }
}

// ============================================================================
// SUCCESS CARD PAGE
// ============================================================================

function createCredentialCard(config) {
  const cardContainer = createTag('div', { class: 'credential-card-container' });

  const cardTitleWrapper = createTag('div', { class: 'card-title-wrapper' });

  // Card title
  if (config.title) {
    const title = createTag('h2', { class: 'spectrum-Heading spectrum-Heading--sizeL card-title' });
    setRichTextContent(title, config.title);
    cardTitleWrapper.appendChild(title);
  }

  // Card paragraph
  if (config.paragraph) {
    const paragraph = createTag('p', { class: 'spectrum-Body spectrum-Body--sizeL  card-paragraph' });
    setRichTextContent(paragraph, config.paragraph);
    cardTitleWrapper.appendChild(paragraph);
  }

  const downloadOptions = createTag('div', { class: 'restart-download-wrapper' });
  downloadOptions.innerHTML = '<p class="spectrum-Body spectrum-Body--sizeS">Download not working?</p><a class="restart-download-link">Restart download</a>';
  // Initially hidden - will be shown only if download was checked
  downloadOptions.style.display = 'none';
  cardTitleWrapper.appendChild(downloadOptions);

  cardContainer.appendChild(cardTitleWrapper);

  const cardWrapper = createTag('div', { class: 'card-wrapper' });

  // Main card content
  const cardContent = createTag('div', { class: 'card-content' });

  // Project Card (will be populated dynamically via updateCredentialCard)
  const isCollapsable = config.isCollapsable === 'true' || config.isCollapsable === true;
  const projectCard = createTag('div', { class: `project-card${isCollapsable ? ' collapsed' : ''}` });
  const projectHeader = createProjectHeader('', config.components?.Products, isCollapsable);
  projectCard.appendChild(projectHeader);

  // Collapsible content wrapper
  const cardCollapsibleContent = createTag('div', { class: 'card-collapsible-content' });

  cardCollapsibleContent.appendChild(createDivider());

  // Card sections driven by JSON config (only sections present in config are shown)
  const cardSectionOrder = ['AccessToken', 'DevConsoleLink', 'CredentialDetails'];
  cardSectionOrder.forEach((key) => {
    if (!config.components?.[key]) return;
    if (key === 'AccessToken') {
      cardCollapsibleContent.appendChild(createAccessTokenSection(config.components.AccessToken));
    } else if (key === 'DevConsoleLink') {
      const devConsoleSection = createTag('div', { class: 'dev-console-section' });
      const devConsoleLabel = createTag('h3', { class: 'section-label spectrum-Heading spectrum-Heading--sizeS' });
      setRichTextContent(devConsoleLabel, config.components.DevConsoleLink.heading);
      devConsoleSection.appendChild(devConsoleLabel);
      const projectLink = createExternalLink('', '#');
      projectLink.setAttribute('data-cy', 'credentialName-link');
      devConsoleSection.appendChild(projectLink);
      cardCollapsibleContent.appendChild(devConsoleSection);
    } else if (key === 'CredentialDetails') {
      const credSection = createCredentialSection(config.components.CredentialDetails);
      cardCollapsibleContent.appendChild(credSection);
    }
  });

  // Buttons section (inside project card)
  const buttonsSection = createTag('div', { class: 'card-buttons' });

  // Next steps button
  if (config.nextStepsLabel && config.nextStepsHref) {
    const nextStepsButton = createTag('a', {
      class: 'spectrum-Button spectrum-Button--outline spectrum-Button--primary spectrum-Button--sizeM',
      href: config.nextStepsHref
    });
    const buttonLabel = createTag('span', { class: 'spectrum-Button-label' });
    setRichTextContent(buttonLabel, config.nextStepsLabel);
    nextStepsButton.appendChild(buttonLabel);
    buttonsSection.appendChild(nextStepsButton);
  }

  // Manage on Developer console link (use config when available)
  const manageLabel = config.developerConsoleManage || config.components?.ManageDeveloperConsole?.label || 'Manage on Developer console';
  const manageHref = config.components?.ManageDeveloperConsole?.direction || config.devConsoleDirection || '/console/';
  const manageLink = createExternalLink(manageLabel, manageHref);
  manageLink.classList.remove('project-link');
  manageLink.classList.add('manage-link');
  buttonsSection.appendChild(manageLink);

  cardCollapsibleContent.appendChild(buttonsSection);

  projectCard.appendChild(cardCollapsibleContent);

  // Toggle collapse on arrow click (only if collapsable)
  if (isCollapsable) {
    const arrowIcon = projectHeader.querySelector('.project-arrow');
    if (arrowIcon) {
      arrowIcon.addEventListener('click', () => {
        projectCard.classList.toggle('collapsed');
      });
    }
  }

  // Add the complete project card to content
  cardContent.appendChild(projectCard);

  // Need another credential section
  const needCredentialSection = createTag('div', { class: 'need-credential' });
  const needCredentialTitle = createTag('div', { class: 'need-credential-title' });
  needCredentialTitle.textContent = 'Need another credential';
  needCredentialSection.appendChild(needCredentialTitle);

  const restartLink = createTag('a', {
    class: 'restart-link',
    href: '#'
  });
  restartLink.textContent = 'Restart and create a new credential';
  needCredentialSection.appendChild(restartLink);

  cardContent.appendChild(needCredentialSection);

  cardWrapper.appendChild(cardContent);

  // Side content
  if (config.components?.Side) {
    cardWrapper.appendChild(separator());
    const sideContent = createSideContent(config.components.Side);
    sideContent.classList.add('card-side-content');
    cardWrapper.appendChild(sideContent);
  }

  cardContainer.appendChild(cardWrapper);
  return cardContainer;
}

/**
 * Resolve template ID for this page/block so we can load the correct credential config.
 * Different template IDs can have different configs (e.g. API Key vs OAuth).
 * Priority: block data attribute > page metadata > undefined (then we match by first row).
 */
function resolveTemplateId(block) {
  const fromBlock = block?.dataset?.templateId || block?.dataset?.templateid;
  if (fromBlock) return fromBlock.trim();
  const fromMeta = getMetadata('templateid') || getMetadata('template-id');
  if (fromMeta) return String(fromMeta).trim();
  return undefined;
}

export default async function decorate(block) {

  const metadata = await fetchSiteMetadata();
  if (!metadata) return;

  const metadataPath = metadata.get('get-credentials');
  if (metadataPath === undefined) return;

  const pathPrefix = getMetadata('pathprefix').replace(/^\/|\/$/g, '');
  const navPath = metadataPath
    ? `${window.location.origin}/${pathPrefix}/${metadataPath}`
    : `${window.location.origin}/${pathPrefix}/credential/getcredential.json`;

  const pageTemplateId = resolveTemplateId(block);
  const isStageOrLocalHost = isStageEnvironment(window.location.host)
    || isLocalHostEnvironment(window.location.host);

  let credentialData;
  let getCredConfig;
  try {
    const response = await fetch(navPath);
    if (!response.ok) throw new Error('Failed to load');
    const credentialJSON = await response.json();
    const dataRows = credentialJSON?.data;
    if (!Array.isArray(dataRows) || dataRows.length === 0) {
      block.innerHTML = '<p>No credential data available.</p>';
      return;
    }

    // Select the row that matches this page's template ID (so different templates show different configs)
    let selectedRow = dataRows[0];
    if (pageTemplateId) {
      const matched = dataRows.find((row) => {
        const gc = row?.GetCredential;
        if (!gc) return false;
        const rowTemplateId = isStageOrLocalHost
          ? (gc.stageTemplateId ?? gc.templateId)
          : gc.templateId;
        return String(rowTemplateId || '') === String(pageTemplateId);
      });
      if (matched) selectedRow = matched;
    }

    getCredConfig = selectedRow?.GetCredential;
    credentialData = getCredConfig?.components;
    if (!credentialData) {
      block.innerHTML = '<p>No credential data available.</p>';
      return;
    }

    // Template data for API calls (create credential, fetch projects, etc.)
    templateData = {
      id: isStageOrLocalHost
        ? (getCredConfig?.stageTemplateId ?? getCredConfig?.templateId)
        : getCredConfig?.templateId
    };

    if (window.adobeIMS && window.adobeIMS.isSignedInUser()) {

      try {
        const orgs = await fetchOrganizations();
        if (orgs && orgs.length > 0) {
          organizationsData = orgs;
          // Initialize organization (from localStorage or default)
          await switchOrganization(null);
        } else {
          // Fallback to config-based organization
          selectedOrganization = {
            code: getCredConfig?.orgId || templateData.orgId,
            name: getCredConfig?.orgName || 'Personal Developer Organization'
          };
        }
      } catch (error) {
        // Fallback to config-based organization
        selectedOrganization = {
          code: getCredConfig?.orgId || templateData.orgId,
          name: getCredConfig?.orgName || 'Personal Developer Organization'
        };
      }
    } else {
      // Get organization data from config as fallback (when not signed in)
      selectedOrganization = {
        code: getCredConfig?.orgId || templateData.orgId,
        name: getCredConfig?.orgName || 'Personal Developer Organization'
      };
    }

  } catch (error) {
    block.innerHTML = '<p>Error loading credential data.</p>';
    return;
  }

  block.innerHTML = '';

  // Create sign-in container (always start as visible, will hide if user is signed in)
  let signInContainer;
  if (credentialData.SignIn) {
    signInContainer = createTag('div', { class: 'sign-in-container' });
    signInContainer.appendChild(createSignInContent(credentialData.SignIn));
    block.appendChild(signInContainer);
  }

  // Create loading page FIRST (used in multiple places below)
  const loadingContainer = createLoadingPage();
  block.appendChild(loadingContainer);

  // Local/stage only: force show Request Access view via ?requestAccess=1 or ?showRequestAccess=true (optional ?edgeCase=NotMember|NoProduct|NotSignUp|Type1User)
  const getForceRequestAccessParams = () => {
    if (!isStageOrLocalHost || !credentialData.RequestAccess) return null;
    const params = new URLSearchParams(window.location.search);
    const on = params.get('requestAccess') === '1' || params.get('showRequestAccess') === 'true';
    if (!on) return null;
    const edgeCase = params.get('edgeCase') || null;
    return { edgeCase };
  };

  // Define navigateTo function FIRST (used in multiple places below)
  const navigateTo = (hideEl, showEl, scroll = false) => {
    hideEl?.classList.add('hidden');
    showEl?.classList.remove('hidden');
    if (scroll) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Function to update cancel button visibility based on projects
  const updateCancelButtonVisibility = async (formContainer) => {
    const cancelButton = formContainer?.querySelector('.cancel-link');
    if (!cancelButton) return;

    try {
      const existingCreds = await fetchExistingCredentials(selectedOrganization?.code);
      const projectsArray = Array.isArray(existingCreds) ? existingCreds : existingCreds?.projects;

      if (!projectsArray || projectsArray.length === 0) {
        // No projects - hide cancel button
        cancelButton.style.display = 'none';
      } else {
        // Has projects - show cancel button
        cancelButton.style.display = '';
      }
    } catch (error) {
      // On error, hide cancel button
      cancelButton.style.display = 'none';
    }
  };

  // Helper function to get organization display name
  const getOrgDisplayName = () => {
    return selectedOrganization?.type === "developer"
      ? 'your personal developer organization'
      : selectedOrganization?.name;
  };

  // Helper function to get form organization text
  const getFormOrgText = () => {
    return `You're creating this credential in <b>${getOrgDisplayName()}</b>  `;
  };

  // Helper function to get return page organization text
  const getReturnOrgText = () => {
    return `You're viewing in <b>${getOrgDisplayName()}</b>  `;
  };

  // Function to update organization text in form
  const updateFormOrgNotice = (formContainer) => {
    const formOrgNotice = formContainer?.querySelector('.org-notice');
    if (formOrgNotice) {
      const formOrgText = formOrgNotice.querySelector('.org-text');
      if (formOrgText) {
        formOrgText.innerHTML = getFormOrgText();
      }
    }
  };

  // Function to update organization text in return page
  const updateReturnOrgNotice = (returnContainer) => {
    const orgNotice = returnContainer?.querySelector('.org-notice-return');
    if (orgNotice) {
      const orgText = orgNotice.querySelector('.org-text');
      if (orgText) {
        orgText.innerHTML = getReturnOrgText();
      }
    }
  };

  // Declare containers at top level for handler access
  let returnContainer;
  let formContainer;
  let requestAccessContainer;
  /** When we show Request Access view, store entitlement (with template) for the modal's accessPlatformAppId and onClose refetch */
  lastRequestAccessEntitlement = null;
  /** Re-render the page after org change: show loading, then form/return or request access. Set after containers exist. */
  let renderPageAfterOrgChange = null;

  // Create Request Access container (shown after sign-in when user/org not entitled).
  // Config comes from credential JSON: GetCredential.components.RequestAccess.
  if (credentialData.RequestAccess) {
    requestAccessContainer = createTag('div', { class: 'request-access-container hidden' });
    requestAccessContainer.appendChild(createRequestAccessContent(credentialData.RequestAccess));
    block.appendChild(requestAccessContainer);

    const requestAccessConfig = credentialData.RequestAccess;
    const restricted = requestAccessConfig.components?.RestrictedAccess;
    const productsConfig = restricted?.components?.Products;
    const products = (productsConfig?.items || []).map((item) => {
      const p = item?.Product || item;
      return { label: p?.label || '', icon: p?.icon || '' };
    });

    requestAccessContainer.addEventListener('click', (e) => {
      const changeOrgLink = e.target.closest('.request-access-change-org-link');
      if (changeOrgLink) {
        e.preventDefault();
        e.stopPropagation();
        const orgs = organizationsData || [];
        const overlay = createOrganizationModal(orgs, selectedOrganization, (newOrg) => {
          switchOrganization(newOrg).then(() => {
            showToast('Organization Changed', 'success', 3000);
            if (renderPageAfterOrgChange) renderPageAfterOrgChange(requestAccessContainer);
          });
        });
        document.body.appendChild(overlay);
        return;
      }
      const trigger = e.target.closest('[data-request-access-trigger]');
      if (!trigger) return;
      e.preventDefault();
      const accessPlatformAppId = lastRequestAccessEntitlement?.template?.accessPlatformAppId;
      if (accessPlatformAppId) {
        createRequestAccessIframeModal({
          accessPlatformAppId,
          onClose: async () => {
            setLoadingText(loadingContainer, 'Loading...');
            navigateTo(requestAccessContainer, loadingContainer);
            const entitlement = await fetchTemplateEntitlement();
            lastRequestAccessEntitlement = entitlement;
            if (entitlement && entitlement.userEntitled && entitlement.orgEntitled) {
              runFormOrReturnFlow();
            } else {
              if (requestAccessContainer && entitlement) {
                const leftCardKey = getRequestAccessLeftCardKey(entitlement, selectedOrganization, credentialData.RequestAccess);
                updateRequestAccessLeftColumn(requestAccessContainer, credentialData.RequestAccess, leftCardKey, { selectedOrganization });
              }
              navigateTo(loadingContainer, requestAccessContainer);
            }
          }
        });
      } else {
        createRequestAccessModal({
          products,
          onSendRequest() {
            showToast('Request sent. Your admin will be notified.', 'success', 4000);
          }
        });
      }
    });
  }

  // Create return container (previously created projects)
  if (credentialData.Return) {

    // Define handleReturnOrgChange handler with access to all containers
    const handleReturnOrgChange = async (newOrg) => {
      try {
        await switchOrganization(newOrg);
        showToast('Organization Changed', 'success', 3000);
        if (renderPageAfterOrgChange) renderPageAfterOrgChange(returnContainer);
      } catch (error) {
        console.error('[ORG SWITCH ERROR]', error);
      }
    };

    // Always create return container as hidden initially
    returnContainer = createTag('div', { class: 'return-container hidden' });
    returnContainer.appendChild(createReturnContent(credentialData.Return, handleReturnOrgChange));
    block.appendChild(returnContainer);

    // Note: Navigation for already signed-in users is now handled by checkAlreadySignedIn()
    // which waits for IMS to be fully loaded before checking sign-in status
  }

  // Create form container
  if (credentialData.Form) {
    const { title, paragraph, components } = credentialData.Form;
    formHasAllowedOrigins = !!components?.AllowedOrigins;
    formContainer = createTag('div', { class: 'getcredential-form hidden' });
    const formHeader = createTag('div', { class: 'form-header' });

    if (title) {
      const titleEl = createTag('h2', { class: 'spectrum-Heading spectrum-Heading--sizeL form-title' });
      setRichTextContent(titleEl, title);
      formHeader.appendChild(titleEl);
    }

    if (paragraph) {
      const paragraphEl = createTag('p', { class: 'spectrum-Body spectrum-Body--sizeL form-description' });
      setRichTextContent(paragraphEl, paragraph);
      formHeader.appendChild(paragraphEl);
    }

    // Organization notice
    const handleOrgChange = async (newOrg) => {
      try {
        await switchOrganization(newOrg);
        showToast('Organization Changed', 'success', 3000);
        if (renderPageAfterOrgChange) renderPageAfterOrgChange(formContainer);
      } catch (error) {
        console.error('[ORG SWITCH ERROR]', error);
      }
    };

    formHeader.appendChild(createOrgNotice(
      getFormOrgText(),
      'org-notice',
      organizationsData,
      selectedOrganization,
      handleOrgChange,
      () => selectedOrganization
    ));

    const formWrapper = createTag('div', { class: 'form-wrapper' });
    const formFields = createTag('form', { class: 'credential-form' });

    // Add form fields dynamically
    const fieldMapping = {
      CredentialName: createCredentialNameField,
      AllowedOrigins: createAllowedOriginsField,
      Downloads: createDownloadsField,
      Products: createProductsField,
      AdobeDeveloperConsole: createAgreementField
    };

    Object.entries(fieldMapping).forEach(([key, fn]) => {
      if (components?.[key]) formFields.appendChild(fn(components[key]));
    });

    // Form buttons
    const formButtons = createTag('div', { class: 'form-buttons' });
    const createButton = createSpectrumButton('Create credential', 'accent', 'M', 'submit');
    createButton.classList.add('create-button');
    createButton.setAttribute('data-cy', 'create-credential-btn');
    // Start disabled
    createButton.setAttribute('disabled', 'true');
    createButton.style.opacity = '0.4';
    createButton.style.cursor = 'not-allowed';

    const cancelButton = createTag('a', { href: '#', class: 'cancel-link' });
    cancelButton.textContent = 'Cancel';

    formButtons.appendChild(createButton);
    formButtons.appendChild(cancelButton);
    formFields.appendChild(formButtons);
    formWrapper.appendChild(formFields);

    if (components?.Side) {
      formWrapper.appendChild(separator());
      formWrapper.appendChild(createSideContent(components.Side));
    }

    formContainer.appendChild(formHeader);
    formContainer.appendChild(formWrapper);
    block.appendChild(formContainer);

    // Update organization text after form is created (in case orgs were loaded before form creation)
    if (selectedOrganization) {
      updateFormOrgNotice(formContainer);
    }
  }

  const showFormFromLoading = () => {
    navigateTo(loadingContainer, formContainer);
    updateFormOrgNotice(formContainer);
    updateCancelButtonVisibility(formContainer);
  };

  const runFormOrReturnFlow = () => {
    if (!returnContainer) {
      showFormFromLoading();
      return;
    }
    fetchExistingCredentials(selectedOrganization?.code).then((existingCreds) => {
      const projectsArray = Array.isArray(existingCreds) ? existingCreds : existingCreds?.projects;
      if (projectsArray?.length > 0) {
        const dataToPass = Array.isArray(existingCreds) ? { projects: existingCreds } : existingCreds;
        const hasProjects = populateProjectsDropdown(returnContainer, dataToPass);
        if (hasProjects) {
          navigateTo(loadingContainer, returnContainer);
          updateReturnOrgNotice(returnContainer);
          return;
        }
      }
      showFormFromLoading();
    }).catch(showFormFromLoading);
  };

  const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  const fetchTemplateEntitlementWithRetry = async (attempts = 4, delayMs = 300) => {
    for (let i = 0; i < attempts; i += 1) {
      const entitlement = await fetchTemplateEntitlement();
      if (entitlement) return entitlement;
      if (i < attempts - 1) {
        await sleep(delayMs);
      }
    }
    return null;
  };

  // Re-render page after organization change: show loading, then entitlement check (if Request Access) and show correct view.
  renderPageAfterOrgChange = (sourceContainer) => {
    setLoadingText(loadingContainer, 'Loading...');
    navigateTo(sourceContainer, loadingContainer);
    fetchTemplateEntitlementWithRetry().then(async (entitlement) => {
      if (requestAccessContainer && entitlement && (entitlement.userEntitled === false || entitlement.orgEntitled === false)) {
        const leftCardKey = getRequestAccessLeftCardKey(entitlement, selectedOrganization, credentialData.RequestAccess);
        const profile = await window.adobeIMS?.getProfile().catch(() => null);
        updateRequestAccessLeftColumn(requestAccessContainer, credentialData.RequestAccess, leftCardKey, { selectedOrganization, userEmail: profile?.email });
        navigateTo(loadingContainer, requestAccessContainer);
      } else {
        runFormOrReturnFlow();
      }
    }).catch(() => runFormOrReturnFlow());
  };

  // Create success card container
  let cardContainer;
  if (credentialData.Card) {
    cardContainer = createTag('div', { class: 'credential-card-wrapper hidden' });
    cardContainer.appendChild(createCredentialCard(credentialData.Card));
    block.appendChild(cardContainer);
  }

  // Setup navigation handlers
  signInContainer?.querySelector('.sign-in-button')?.addEventListener('click', () => {
    if (window.adobeIMS?.isSignedInUser()) {
      navigateTo(signInContainer, returnContainer);
    }
    else {
      waitForIMSAndSignIn();
    }
  });

  returnContainer?.querySelector('.create-new-button')?.addEventListener('click', async () => {

    // Ensure organizations are loaded
    if (!organizationsData || organizationsData.length === 0) {
      try {
        const orgs = await fetchOrganizations();
        if (orgs && orgs.length > 0) {
          organizationsData = orgs;
          await switchOrganization(null);
          // Update form organization text after switching
          updateFormOrgNotice(formContainer);
        }
      } catch (error) {
      }
    }

    // Ensure organization is selected
    if (!selectedOrganization) {
      try {
        await switchOrganization(null);
      } catch (error) {
        showToast('Unable to load organization. Please refresh the page.', 'error', 5000);
        return;
      }
    }

    // Clear the form before navigating
    clearForm(formContainer);
    navigateTo(returnContainer, formContainer, true);
    updateFormOrgNotice(formContainer);
    updateCancelButtonVisibility(formContainer);
  });

  formContainer?.querySelector('.create-button')?.addEventListener('click', async (e) => {
    e.preventDefault();

    // Validate all fields before submission
    const isCredentialNameValid = validationState.CredentialName.valid;
    const isAllowedOriginsValid = validationState.AllowedOrigins.valid;
    const isCredentialNameFilled = formData.CredentialName.trim() !== '';
    const isAgreementChecked = formData.AdobeDeveloperConsole;

    if (!isCredentialNameFilled || !isCredentialNameValid || !isAllowedOriginsValid || !isAgreementChecked) {
      return;
    }

    // Show loading page with "Creating credentials..." text

    setLoadingText(loadingContainer, 'Creating credentials...');
    navigateTo(formContainer, loadingContainer, true);

    try {
      // Call API to create credential

      const result = await createCredential();

      if (result?.success) {
        // Store response data
        credentialResponse = result.data;

        // Update card with dynamic values
        updateCredentialCard(cardContainer, credentialResponse);

        // API response received - Hide loading page and show success card
        navigateTo(loadingContainer, cardContainer, true);

        // Show/hide restart download section based on whether download was checked
        const restartDownloadWrapper = cardContainer?.querySelector('.restart-download-wrapper');
        if (restartDownloadWrapper) {
          const downloadsCheckbox = formContainer?.querySelector('.downloads-checkbox');
          if (downloadsCheckbox?.checked && formData.Downloads) {
            restartDownloadWrapper.style.display = 'flex';
          } else {
            restartDownloadWrapper.style.display = 'none';
          }
        }

        // Show success toast immediately when card opens
        setTimeout(() => {
          showToast('Your credential created successfully', 'success', 4000);
        }, 100);

        // Trigger download if downloads checkbox is checked
        const downloadsCheckbox = formContainer?.querySelector('.downloads-checkbox');

        if (downloadsCheckbox?.checked && formData.Downloads && credentialResponse) {
          const orgId = await getOrgIdWithFallback(selectedOrganization?.id);

          const projectId = credentialResponse.projectId;
          const workspaceId = credentialResponse.workspaceId;
          const fileName = formData.CredentialName || 'credential';
          const zipFileURL = formData.Download?.href;

          if (orgId && zipFileURL) {
            const downloadAPI = `/console/api/organizations/${orgId}/projects/${projectId}/workspaces/${workspaceId}/download`;

            // Trigger download after card is fully visible
            setTimeout(async () => {
              try {
                await downloadZipViaApi(downloadAPI, zipFileURL, fileName);
              } catch (error) {
                console.error('[DOWNLOAD ERROR]', error);
                showToast('Download failed. Please use the restart download link below.', 'error', 5000);
              }
            }, 1500);
          }
        }

      } else {
        // API response received (failed) - Hide loading and show form again
        navigateTo(loadingContainer, formContainer);
      }
    } catch (error) {
      navigateTo(loadingContainer, formContainer);
      showToast(`Error: ${error.message}`, 'error', 5000);
    }
  });

  formContainer?.querySelector('.cancel-link')?.addEventListener('click', (e) => {
    e.preventDefault();
    setLoadingText(loadingContainer, 'Loading...');
    navigateTo(formContainer, loadingContainer, true);
    runFormOrReturnFlow();
  });

  cardContainer?.querySelector('.restart-link')?.addEventListener('click', (e) => {
    e.preventDefault();
    // Clear the form before navigating
    clearForm(formContainer);
    navigateTo(cardContainer, formContainer, true);
    updateFormOrgNotice(formContainer);
    updateCancelButtonVisibility(formContainer);
  });

  // Add event listener for restart download link
  cardContainer?.querySelector('.restart-download-link')?.addEventListener('click', async (e) => {
    e.preventDefault();

    if (credentialResponse) {
      const orgId = await getOrgIdWithFallback(selectedOrganization?.id || credentialResponse.orgId);
      const projectId = credentialResponse.projectId;
      const workspaceId = credentialResponse.workspaceId;
      const fileName = formData.CredentialName || 'credential';
      const zipFileURL = formData.Download?.href;

      if (orgId && projectId && workspaceId && zipFileURL) {
        const downloadAPI = `/console/api/organizations/${orgId}/projects/${projectId}/workspaces/${workspaceId}/download`;
        try {
          await downloadZipViaApi(downloadAPI, zipFileURL, fileName);
          showToast('Download started successfully', 'success', 2000);
        } catch (error) {
          showToast('Failed to download credential files', 'error', 3000);
        }
      }
    }
  });

  // ============================================================================
  // IMS AUTHENTICATION HANDLERS
  // ============================================================================

  // Handle IMS callback after sign-in redirect
  const handleIMSCallback = () => {
    const hash = window.location.hash;
    if (hash && hash.includes('access_token=')) {
      window.history.replaceState(null, '', window.location.pathname);

      // Show loading page during sign-in process
      setLoadingText(loadingContainer, 'Loading...');
      navigateTo(signInContainer, loadingContainer, true);

      // Wait for IMS to process the token
      if (window.adobeIMS) {
        const checkSignIn = setInterval(() => {
          const isSignedIn = window.adobeIMS.isSignedInUser();
          if (isSignedIn) {
            clearInterval(checkSignIn);
            // Fetch organizations first
            fetchOrganizations().then(async (orgs) => {
              if (orgs && orgs.length > 0) {
                organizationsData = orgs;
                try {
                  await switchOrganization(null);
                } catch (error) {}
              }
              // Local/stage: ?requestAccess=1 forces Request Access view without calling entitlement API
              const forceParams = getForceRequestAccessParams();
              if (forceParams && requestAccessContainer) {
                const profile = await window.adobeIMS?.getProfile().catch(() => null);
                updateRequestAccessLeftColumn(requestAccessContainer, credentialData.RequestAccess, forceParams.edgeCase, { selectedOrganization, userEmail: profile?.email });
                navigateTo(loadingContainer, requestAccessContainer);
                return;
              }
              // Fetch template data (populates templateData.apis for credential creation)
              // and check entitlement (same as React: !template.userEntitled || !template.orgEntitled -> RequestAccess)
              const entitlement = await fetchTemplateEntitlement();
              if (requestAccessContainer && entitlement && (entitlement.userEntitled === false || entitlement.orgEntitled === false)) {
                lastRequestAccessEntitlement = entitlement;
                const leftCardKey = getRequestAccessLeftCardKey(entitlement, selectedOrganization, credentialData.RequestAccess);
                const profile = await window.adobeIMS?.getProfile().catch(() => null);
                updateRequestAccessLeftColumn(requestAccessContainer, credentialData.RequestAccess, leftCardKey, { selectedOrganization, userEmail: profile?.email });
                navigateTo(loadingContainer, requestAccessContainer);
                return;
              }
              runFormOrReturnFlow();
            });
          }
        }, 100);

        setTimeout(() => {
          clearInterval(checkSignIn);
        }, 5000);
      }
    }
  };

  let signInStateWatcherInterval = null;
  let signInStateWatcherTimeout = null;
  let isResolvingSignedInState = false;
  const stopSignInStateWatcher = () => {
    if (signInStateWatcherInterval) {
      clearInterval(signInStateWatcherInterval);
      signInStateWatcherInterval = null;
    }
    if (signInStateWatcherTimeout) {
      clearTimeout(signInStateWatcherTimeout);
      signInStateWatcherTimeout = null;
    }
  };
  const startSignInStateWatcher = () => {
    stopSignInStateWatcher();
    const trySyncSignedInState = () => {
      if (signInContainer?.classList.contains('hidden')) {
        stopSignInStateWatcher();
        return;
      }
      if (window.adobeIMS?.isSignedInUser?.()) {
        void checkAlreadySignedIn();
        stopSignInStateWatcher();
      }
    };
    trySyncSignedInState();
    signInStateWatcherInterval = setInterval(trySyncSignedInState, 250);
    signInStateWatcherTimeout = setTimeout(() => {
      stopSignInStateWatcher();
    }, 10000);
  };

  // Check if user is already signed in when page loads
  const checkAlreadySignedIn = async () => {
    // Don't check if we're handling an OAuth callback
    const hash = window.location.hash;
    if (hash && hash.includes('access_token=')) {
      return; // Let handleIMSCallback handle this
    }

    // Check if user is already signed in
    if (window.adobeIMS && window.adobeIMS.isSignedInUser()) {
      if (!signInContainer || signInContainer.classList.contains('hidden')) {
        return;
      }
      if (isResolvingSignedInState) {
        return;
      }
      isResolvingSignedInState = true;

      // User is already signed in - hide sign-in page and show appropriate content
      if (signInContainer && !signInContainer.classList.contains('hidden')) {
        try {
        // Navigate from sign-in to loading
        setLoadingText(loadingContainer, 'Loading...');
        navigateTo(signInContainer, loadingContainer, true);

        const forceParams = getForceRequestAccessParams();
        if (forceParams && requestAccessContainer) {
          const profile = await window.adobeIMS?.getProfile().catch(() => null);
          updateRequestAccessLeftColumn(requestAccessContainer, credentialData.RequestAccess, forceParams.edgeCase, { selectedOrganization, userEmail: profile?.email });
          navigateTo(loadingContainer, requestAccessContainer);
          return;
        }

        await ensureSignedInContextAndOrganizations();

        // Fetch template data (populates templateData.apis for credential creation)
        // and check entitlement (same as React: !template.userEntitled || !template.orgEntitled -> RequestAccess)
        const entitlement = await fetchTemplateEntitlementWithRetry();
        if (requestAccessContainer && entitlement && (entitlement.userEntitled === false || entitlement.orgEntitled === false)) {
          lastRequestAccessEntitlement = entitlement;
          const leftCardKey = getRequestAccessLeftCardKey(entitlement, selectedOrganization, credentialData.RequestAccess);
          const profile = await window.adobeIMS?.getProfile().catch(() => null);
          updateRequestAccessLeftColumn(requestAccessContainer, credentialData.RequestAccess, leftCardKey, { selectedOrganization, userEmail: profile?.email });
          navigateTo(loadingContainer, requestAccessContainer);
          return;
        }
        runFormOrReturnFlow();
      } catch (error) {
        runFormOrReturnFlow();
      } finally {
        isResolvingSignedInState = false;
      }
    }
    }
  };

  // Check for IMS callback on page load
  handleIMSCallback();

  // Check when IMS loads if user is already signed in
  window.addEventListener('adobeIMS:loaded', () => {
    handleIMSCallback();
    void checkAlreadySignedIn();
    startSignInStateWatcher();
  });

  window.addEventListener('imsReady', () => {
    handleIMSCallback();
    void checkAlreadySignedIn();
    startSignInStateWatcher();
  });

  if (window.adobeIMS && window.adobeIMS.isSignedInUser()) {
    void checkAlreadySignedIn();
  } else {
    startSignInStateWatcher();
  }

  // Copy button functionality for API key
  document.addEventListener('click', (e) => {
    if (e.target.closest('.copy-button')) {
      const button = e.target.closest('.copy-button');
      const textToCopy = button.getAttribute('data-copy');
      navigator.clipboard.writeText(textToCopy).then(() => {
        const originalHTML = button.innerHTML;
        button.innerHTML = '<svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor"><path d="M13.854 3.646a.5.5 0 0 1 0 .708l-7 7a.5.5 0 0 1-.708 0l-3.5-3.5a.5.5 0 1 1 .708-.708L6.5 10.293l6.646-6.647a.5.5 0 0 1 .708 0z"/></svg>';
        setTimeout(() => {
          button.innerHTML = originalHTML;
        }, 2000);
      });
    }
  });

}
