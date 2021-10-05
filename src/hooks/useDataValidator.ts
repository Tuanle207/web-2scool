import { useState } from 'react';
import { Util } from '../common/interfaces';
import { withoutVNSign }from '../common/utils/StringHelper'
import { hasError } from '../common/utils/DataValidation';

export default function useDataValidator()
: {
  errors: Array<Util.DataError>;
  validate: (propertyName: string, value: any, validators: Array<string> | string) => string | undefined;
  getError: (propertyName: string) => {error: boolean; helperText: string}
} {
  const [ errors, setErrors ] = useState<Array<Util.DataError>>([]);

  const validate = (propertyName: string, value: any, validators: Array<string> | string): string | undefined => {
    const id = withoutVNSign(propertyName);
    const newErr = errors.filter(el => el.id !== id);

    if (Array.isArray(validators)) {
      validators.forEach(val => {
        const validationResult = hasError(propertyName, value, val);
        validationResult && newErr.push({ 
          id: id,
          msg: validationResult
        });
      })
    } else if (typeof validators === 'string'){
      const validationResult = hasError(propertyName, value, validators);
      validationResult && validationResult && newErr.push({ 
        id: id,
        msg: validationResult
      });
    }
    setErrors(newErr);
    const err = errors.find(el => el.id === id);
    return err ? err.msg : undefined;
  };

  const getError = (propertyName: string): {error: boolean; helperText: string} => {
    const id = withoutVNSign(propertyName);
    const result = errors.find(el => el.id === id);
    if (result) return {
      error: true,
      helperText: result.msg
    };
    return {
      error: false,
      helperText: ''
    };
  };

  return {
    errors,
    validate,
    getError
  }
}