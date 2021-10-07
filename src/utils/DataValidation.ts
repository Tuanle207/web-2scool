import { Util } from '../interfaces';

const hasError = (propertyName: string, value: any, validator: string)
  : string | undefined => {
    
  if (!Rules[validator].validate(value)) {
    return Rules[validator].getErrMessage(propertyName);
  }
};

const Rules: Util.IObject<{
  getErrMessage: (propertyName: string) => string;
  validate: (value: any) => boolean;
}> = {
  isNotEmpty: {
    getErrMessage: (propertyName: string) => `Không thể bỏ trống ${propertyName}`,
    validate: (value: string) => typeof value === 'string' && value.trim() !== '',
  },
};


const Validator = {
  isNotEmpty: 'isNotEmpty'
};

export {
  hasError,
  Validator
};