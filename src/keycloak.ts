import Keycloak from 'keycloak-js';

// Keycloak configuration
const keycloakConfig = {
  url: 'https://login.candidstudios.net',
  realm: 'candidstudios',
  clientId: 'candid-dash',
};

// Initialize Keycloak instance
const keycloak = new Keycloak(keycloakConfig);

export default keycloak;
