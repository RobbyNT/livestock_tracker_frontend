export const ENVIRONMENT = {
    production: false,
    apiUrl: 'http://localhost:8000',
    version: '1.0.0-dev',
    debugMode: true,
    featureFlags: {
        enableNewUI: true,
        enableExperimentalFeatures: false
    },
    appUrl: 'http://localhost:4200',
    auth0: {
        clientId: 'TRIBC69gYHlSt31lOPREpWlRT1Op44GD',
        domain: 'infinitysolutionsit.us.auth0.com',
        audience: 'https://api.ranchxpert.com',
        redirectUri: 'http://localhost:4200/login/callback',
    }
}