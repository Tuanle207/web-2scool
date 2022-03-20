import { dialogService, IDialogOptions, IDialogResult, IDialogInput } from '../services';

interface IDialogUtils<T = any> {
  showDialog: (input?: IDialogInput, options?: IDialogOptions) => Promise<IDialogResult<T>>;
}

export function useDialog<T = any>(defaultOptions: IDialogOptions = { type: 'default' }): IDialogUtils<T> {

  const showDialog = async (input?: IDialogInput, options?: IDialogOptions): Promise<IDialogResult<T>> => {
    const formOptions = {...defaultOptions, ...options};
    return dialogService.show(input, formOptions)
  };

  return { showDialog };
}