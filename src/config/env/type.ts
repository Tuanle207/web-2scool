export interface IEnvConfig {
  env: string;
  host: string;
  appUrl: string;
  oAuthConfig: {
    issuer: string;
    clientId: string;
    clientSecret: string;
    responseType: string;
    scope: string;
  };
  enableLogger: boolean;
}

export enum EnvType {
  Development = 'Development',
  Deployment = 'Deployment',
}