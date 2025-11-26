import Keycloak from 'keycloak-js';

// Keycloak configuration - using master realm
// Keycloak server hostname matches KC_HOSTNAME setting
const keycloakConfig = {
  url: 'https://login.candidstudios.net',
  realm: 'master',
  clientId: 'candid-dash',
};

// Initialize Keycloak instance
const keycloak = new Keycloak(keycloakConfig);

export default keycloak;
