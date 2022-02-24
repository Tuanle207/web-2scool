import { IEnvConfig, EnvType } from './type';

const ENV: IEnvConfig = {
  env: EnvType.Development,
  host: 'http://147.182.219.63:5001',
  appUrl: 'http://quanlynenep.tech:3000',
  oAuthConfig: {
    issuer: 'http://147.182.219.63:5001',
    clientId: 'Scool_App_Test_Deployment',
    responseType: 'code',
    clientSecret: '1q2w3e*',
    scope: 'offline_access openid profile role email phone Scool',
  },
  enableLogger: true
  
};

export default ENV;