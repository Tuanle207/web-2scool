import { useEffect } from 'react';
import { Control, UseFormTrigger, FormState } from 'react-hook-form';
import Dialog from '../components/Modal/Dialog';

interface IDialogControllerUtils {
  onSubmit: () => void;
  forceCloseDialog: () => void;
}

export interface IDialogControllerOptions<TFieldValues, TContext extends object = object> {
  control: Control<TFieldValues, TContext>;
  trigger: UseFormTrigger<TFieldValues>;
  formState: FormState<TFieldValues>;
}

export function useDialogController<TFieldValues, TContext extends object = object>({
  control, trigger, formState
}: IDialogControllerOptions<TFieldValues, TContext>): IDialogControllerUtils {
  
  useEffect(() => {
    Dialog.setFormController({control, trigger, formState});
  }, [ control, trigger, formState ]);

  const forceCloseDialog = () => {
    Dialog.forceClose();
  };

  const onSubmit = () => {
    Dialog.forceSubmit();
  };

  return { onSubmit, forceCloseDialog };
}