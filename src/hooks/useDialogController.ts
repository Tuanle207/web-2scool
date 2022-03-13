import { useEffect } from 'react';
import { Control, UseFormHandleSubmit } from 'react-hook-form';
import Dialog from '../components/Modal/Dialog';

interface IDialogControllerUtils {
  onSubmit: () => void;
  forceCloseDialog: () => void;
}

export interface IDialogControllerOptions<TFieldValues, TContext extends object = object> {
  control: Control<TFieldValues, TContext>;
  handleSubmit: UseFormHandleSubmit<TFieldValues>;
}

export function useDialogController<TFieldValues, TContext extends object = object>({
  control, handleSubmit
}: IDialogControllerOptions<TFieldValues, TContext>): IDialogControllerUtils {
  
  useEffect(() => {
    Dialog.setFormController({control, handleSubmit});
  }, [ control, handleSubmit ]);

  const forceCloseDialog = () => {
    Dialog.forceClose();
  };

  const onSubmit = () => {
    Dialog.forceSubmit();
  };

  return { onSubmit, forceCloseDialog };
}