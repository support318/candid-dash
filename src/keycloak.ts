import Keycloak from 'keycloak-js';

// Keycloak configuration - using master realm
// Keycloak server is at admin.candidstudios.net
const keycloakConfig = {
  url: 'https://admin.candidstudios.net',
  realm: 'master',
  clientId: 'candid-dash',
};

// Initialize Keycloak instance
const keycloak = new Keycloak(keycloakConfig);

export default keycloak;
