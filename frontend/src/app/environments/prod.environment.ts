export const ENVIRONMENT = {
  production: true,
  apiUrl: 'https://api.ranchxpert.com',
  authUrl: 'https://api.ranchxpert.com/auth',
  version: '1.0.0-prod',
  debugMode: false,
  featureFlags: {
    enableNewUI: true,
    enableExperimentalFeatures: false,
  },
  appUrl: 'https://app.ranchxpert.com',
  auth0: {
    clientId: 'TRIBC69gYHlSt31lOPREpWlRT1Op44GD',
    domain: 'infinitysolutionsit.us.auth0.com',
    audience: 'https://api.ranchxpert.com',
    redirectUri: 'https://app.ranchxpert.com/login/callback',
  },
};
