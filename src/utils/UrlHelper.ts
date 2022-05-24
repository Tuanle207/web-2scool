import ENV from '../config/env';
import { EnvType } from '../config/env/type';

const getTenantNameFromCurrentLocation = (): string => {
  let tenant = '';
  const hostParts = window.location.host.split('.');
  if (ENV.env === EnvType.Development) {
    if (hostParts.length === 2) {
      tenant = hostParts[0];
    } else if (hostParts.length === 1) {
      tenant = ''
    }
  } 
  if (ENV.env === EnvType.Deployment) {
    if (hostParts.length === 3) {
      tenant = hostParts[0];
    }
  }

  return tenant;
};

export {
  getTenantNameFromCurrentLocation,
};