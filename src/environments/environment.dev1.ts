// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
  firebase: {},

  debug: true,
  log: {
    auth: false,
    store: false,
  },

  smartadmin: {
    apiDev1Url: 'https://workmate-svc-dev1.kubeodc-test.corp.intranet/RestService',
    apiDev2Url: 'https://workmate-svc-dev2.kubeodc-test.corp.intranet/RestService',
    apiTest1Url: 'https://workmate-svc-test1.kubeodc-test.corp.intranet/RestService',
    apiTest2Url: 'https://workmate-svc-test2.kubeodc-test.corp.intranet/RestService',
    apiTest3Url: 'https://workmate-svc-test3.kubeodc-test.corp.intranet/RestService',
    apiTest4Url: 'https://workmate-svc-test4.kubeodc-test.corp.intranet/RestService',
    apiProdUrl: 'https://workmate-svc-prod.kubeodc.corp.intranet/RestService',
    api: null,
    db: 'smartadmin-angular'
  },

    envName: 'development',
    production: false,
    user: 'workmate',
    password: 'Ctli@123',
    ruleApiUrl: 'https://workmate-rulz-dev1.kubeodc.corp.intranet/',
    apiUrl: 'https://workmate-svc-dev2.kubeodc-test.corp.intranet/RestService',
    ssoUrl: 'https://sso-authgateway-dev2.kubeodc.corp.intranet/sso/',
    testUserId: 'ab46179',
    'output-path': './resources/static',
    sessionDefaultTimeout: 30 * 60, // sec
    sessionWarnAt: 120, //secs
    clientId: 'default-client',
    secret: 'sssshhh',
    redirectUrl: 'http://localhost:4200/#/dashboard/analytics',
    resourceUrl: 'user/me'
};