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

  envName: 'prod',
  production: false,
  user: 'workmate',
  password: 'Ctli@123',
  ruleApiUrl: 'https://workmate-rulz-dev1.kubeodc.corp.intranet/',
  apiUrl: 'https://workmate-svc-dev2.kubeodc-test.corp.intranet/RestService',
  ssoUrl: 'https://sso-authgateway-dev2.kubeodc.corp.intranet/sso/',
  topologyViewUrl: "https://topologyviewer-ui-dev2.kubeodc.corp.intranet/",
  testUserId: 'ab46179',
  'output-path': './resources/static',
  sessionDefaultTimeout: 30 * 60, // sec
  sessionWarnAt: 120, //secs
  clientId: 'default-client',
  secret: 'sssshhh',
  redirectUrl: 'https://localhost:4200/#/dashboard/analytics',
  resourceUrl: 'user/me',
  swiftOrderBrokerUrl: '',
  swiftOrderBrokerUrls: {
    dev1: 'https://mediation-dev1.level3.com/Application/v1/OrderRouting/',
    dev2: 'https://mediation.level3.com/Application/v1/OrderRouting/',
    test1: 'https://mediation-env1.level3.com/Application/v1/OrderRouting/',
    test2: 'https://mediation-env2.level3.com/Application/v1/OrderRouting/',
    test3: 'https://mediation-env3.level3.com/Application/v1/OrderRouting/',
    test4: 'https://mediation-env4.level3.com/Application/v1/OrderRouting/',
    prod: 'https://mediation.level3.com/Application/v1/OrderRouting/',
  },
  appKey : 'APPKEY014642018112714342564075950',
  appSecret: 'AKI881882018112714342564014793'
};
