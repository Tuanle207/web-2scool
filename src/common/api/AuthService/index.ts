// import { Log, User, UserManager, WebStorageStateStore } from 'oidc-client';
// import { configEnv } from '../../@config';
import login from './login';
import logout from './logout';

const AuthService = {
  login,
  logout
};

export default AuthService;

// export class AuthService {
//   public userManager: UserManager;

//   constructor() {
//     const settings = {
//       authority: configEnv().oAuthConfig.issuer,
//       jwks_uri: configEnv().oAuthConfig.issuer,
//       client_id: configEnv().oAuthConfig.clientId,
//       redirect_uri: configEnv().appUrl,
//       silent_redirect_uri: configEnv().appUrl,
//       post_logout_redirect_uri: configEnv().appUrl,
//       response_type: configEnv().oAuthConfig.responseType,
//       scope: configEnv().oAuthConfig.scope,
//       userStore: new WebStorageStateStore({ store: window.localStorage })
//     };
//     this.userManager = new UserManager(settings);

//     Log.logger = console;
//     Log.level = Log.INFO;
//   }

//   public getUser(): Promise<User | null> {
//     return this.userManager.getUser();
//   }

//   public login(): Promise<void> {
//     return this.userManager.signinRedirect();
//   }

//   public renewToken(): Promise<User> {
//     return this.userManager.signinSilent();
//   }

//   public logout(): Promise<void> {
//     return this.userManager.signoutRedirect();
//   }
// }