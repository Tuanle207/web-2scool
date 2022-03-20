import { FC } from 'react';
import Dialog, { ModalOptions } from '../components/Modal/Dialog';
import { Util } from '../interfaces';

type IDialogInput = null | undefined | Util.IObject;

export type {
  IDialogInput
}

export interface IDialogResult<T> {
  data?: T;
  result: 'Ok' | 'Cancel'
}

export interface IDialogOptions extends Omit<ModalOptions, 'component' | 'onAccept' | 'onCancel' | 'onClose'>   {
  type?: 'default' | 'data';
  renderFormComponent?: FC<any>;
}

class DialogService {

  private static _instance?: DialogService;

  public static get instance(): DialogService {
    if (!DialogService._instance) {
      DialogService._instance = new DialogService();
    }
    return DialogService._instance
  }
  
  public async show<T = any>(input?: IDialogInput, options?: IDialogOptions): Promise<IDialogResult<T>> {
    const props = input ?? {};
    const FormComponent = options?.renderFormComponent ?? undefined;
    const type = options?.type;
    
    return new Promise((resolve) => {
      Dialog.show({
        component: (type === 'data' && FormComponent) ? <FormComponent {...props} /> as any : undefined,
        accept: (data: any) => resolve({ result: 'Ok', data }),
        cancel: () => resolve({ result: 'Cancel' }),
        ...options
      });
    });
  };

}

export const dialogService = DialogService.instance;