import { createAction } from '@reduxjs/toolkit';
import { User } from '../../interfaces';
import { IAuthState } from '../reducers/AuthReducer';

const postLoginAsync = createAction( 
  'app/AuthAction/postLoginAsync', 
  (payload: User.LoginReqBody) => ({payload}) 
);

const setLogin = createAction( 
  'app/AuthAction/setLogin', 
  (payload: User.LoginResponse) => ({payload}) 
);

const postLogoutAsync = createAction( 
  'app/AuthAction/postLogoutAsync' 
);

export const AuthActions = {
  // theses are actions just created! 
  postLoginAsync,
  setLogin,
  postLogoutAsync
};
