import { IEnvConfig, EnvType } from './type';

const ENV: IEnvConfig = {
  env: EnvType.Development,
  host: 'http://localhost:5000',
    appUrl: 'http://localhost:3000',
    oAuthConfig: {
      issuer: 'http://localhost:5000',
      clientId: 'Scool_App',
      clientSecret: '1q2w3e*',
      responseType: 'code',
      scope: 'offline_access Scool',
    },
  enableLogger: false
};

export default ENV;