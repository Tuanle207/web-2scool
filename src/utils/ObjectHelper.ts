import { Util } from '../interfaces';

const cleanObject = (object: Util.IObject) => Object.keys(object).forEach((key: string) => { delete object[key]; });

export {
  cleanObject
};