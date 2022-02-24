import { IEnvConfig, EnvType } from './type';

const ENV: IEnvConfig = {
  env: EnvType.Deployment,
  host: '<API_URL>',
  appUrl: '<APP_URL>',
  oAuthConfig: {
    issuer: '<AUTH_URL>',
    clientId: '<CLIENT_ID>',
    clientSecret: '<CLIENT_SECRET>',
    responseType: 'code',
    scope: 'offline_access Scool',
  },
  enableLogger: false
};

export default ENV;