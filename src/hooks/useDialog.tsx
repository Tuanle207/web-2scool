import { FC } from 'react';
import Dialog, { ModalOptions } from '../components/Modal/Dialog';
import { Util } from '../interfaces';

type IDialogInput = null | undefined | Util.IObject;

interface IDialogUtils<T = any> {
  showDialog: (input?: IDialogInput, options?: IDialogOptions) => Promise<IDialogResult<T>>;
}

interface IDialogResult<T> {
  data?: T;
  result: 'Ok' | 'Cancel'
}

export interface IDialogOptions extends Omit<ModalOptions, 'component' | 'onAccept' | 'onCancel' | 'onClose'>   {
  type?: 'default' | 'data';
  renderFormComponent?: FC<any>;
}

export function useDialog<T = any>(defaultOptions: IDialogOptions = { type: 'default' }): IDialogUtils<T> {

  const showDialog = async (input?: IDialogInput, options?: IDialogOptions): Promise<IDialogResult<T>> => {
    const props = input ?? {};
    const FormComponent = options?.renderFormComponent ? options.renderFormComponent :
      defaultOptions.renderFormComponent ? defaultOptions.renderFormComponent : undefined;
    const formOptions = {...defaultOptions, ...options};
    formOptions.renderFormComponent = undefined;
    formOptions.type = undefined;

    const type = options?.type ? options.type : defaultOptions.type;
    
    return new Promise((resolve) => {
      Dialog.show({
        component: (type === 'data' && FormComponent) ? <FormComponent {...props} /> : undefined,
        accept: (data: any) => resolve({ result: 'Ok', data }),
        cancel: () => resolve({ result: 'Cancel' }),
        ...formOptions
      });
    });
  };

  

  return { showDialog };
}