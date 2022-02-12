import { IEnvConfig, EnvType } from './type';

const ENV: IEnvConfig = {
  env: EnvType.Development,
  host: 'http://localhost:5000',
  appUrl: 'http://localhost:3000',
  oAuthConfig: {
    issuer: 'http://localhost:5000',
    clientId: 'Scool_App',
    responseType: 'code',
    clientSecret: '1q2w3e*',
    scope: 'offline_access openid profile role email phone Scool',
  },
  enableLogger: true
  
};

export default ENV;