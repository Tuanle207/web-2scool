import { IEnvConfig, EnvType } from './type';

const ENV: IEnvConfig = {
  env: EnvType.Development,
  host: 'http://quanlynenep.tech:5000',
  appUrl: 'http://quanlynenep.tech',
  oAuthConfig: {
    issuer: 'http://quanlynenep.tech:5000',
    clientId: 'Scool_App',
    responseType: 'code',
    clientSecret: '1q2w3e*',
    scope: 'offline_access openid profile role email phone Scool',
  },
  enableLogger: true
  
};

export default ENV;