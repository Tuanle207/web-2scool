import ENV from '../config/env';

const getFullUrl = (relativePath: string) => {
  return `${ENV.host}${relativePath}`;
};

export {
  getFullUrl,
};