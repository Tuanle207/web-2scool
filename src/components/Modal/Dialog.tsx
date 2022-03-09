import React from 'react';
import {
  Box, 
  Button, 
  Grid, 
  IconButton,
  Modal, 
  Typography 
} from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import HighlightOffIcon from '@material-ui/icons/HighlightOff';
import { 
  Control, 
  FormState, 
  UseFormTrigger 
} from 'react-hook-form';
import { IDialogControllerOptions } from '../../hooks';
import styles from '../../assets/jss/components/Modal';


export interface ModalOptions {
  component?: JSX.Element;
  title?: string;
  acceptText?: string;
  cancelText?: string;
  noCancelButton?: boolean;
  noAcceptButton?: boolean;
  accept?: (data: any) => void;
  cancel?: () => void;
}


interface ModalState extends ModalOptions {
  visible: boolean;
  dirty: boolean;
  formControl?: Control<any>;
  trigger?: UseFormTrigger<any>;
  formState?: FormState<any>;
}

const initialState: ModalState = {
  title: 'Xác nhận tiếp tục?',
  acceptText: 'Xác nhận',
  cancelText: 'Hủy',
  noCancelButton: false,
  noAcceptButton: false,
  component: undefined,
  dirty: false,
  visible: false,
  formControl: undefined,
  trigger: undefined,
  formState: undefined,
  accept: () => {},
  cancel: () => {},
};

class Dialog extends React.Component<{}, ModalState> {
  
  private static _current?: Dialog;

  constructor(props: any) {
    super(props);
    this.state = initialState;
  }

  get formControl(): Control<any> | undefined {
    return this.state.formControl;
  }

  get formState(): FormState<any> | undefined {
    return this.state.formState;
  }

  get isDirty(): boolean {
    return this.state.dirty;
  }
  
  set isDirty(value: boolean) {
    this.setState((prev) => ({
      ...prev,
      dirty: value
    }));
  }

  get isFormDirty(): boolean {
    return Object.keys(this.formControl?._formState.dirtyFields || {}).length > 0;
  }

  get isFormValid(): boolean {
    return this.formState?.isValid ?? true;
  }

  get accept(): (data: any) => void {
    const defaultHandler = (data: any) => {};
    return this.state.accept ?? defaultHandler;
  }

  get cancel(): () => void {
    const defaultHandler = () => {};
    return this.state.cancel ?? defaultHandler;
  }

  componentDidMount() {
    Dialog._current = this;
  }

  componentWillUnmount() {
    Dialog._current = undefined;
  }

  closeModal = () => {
    this.setState({
      ...initialState
    });
  };

  onAccept = async () => {
    if (!this.isFormValid) {
      await this.triggerValidation();
    }
    if (!this.isFormValid) {
      return;
    }
    if (this.isDirty) {
      this.isDirty = false;
    }

    this.accept(this.formControl?._formValues || {});
    this.closeModal();
  };

  onCancel = () => {
    if (this.isFormDirty && !this.isDirty) {
      this.isDirty = true;
      return;
    } else {
      this.isDirty = false;
    }
    this.cancel();
    this.closeModal();
  };

  onCloseConfirmAlert = () => {
    if (this.isDirty) {
      this.isDirty = false;
    }
  }

  async triggerValidation(): Promise<void> {
    await this.state.trigger?.call(null);
  }

  render() {
    return (
      <Modal
        open={this.state.visible}
        aria-labelledby="scool-modal"
        aria-describedby="scool-modal-global"
      >
        <div style={styles.root}>
          <Box>
            <Grid item container direction='row' justify='space-between' alignItems='center' style={styles.titleBar}>
              <Typography variant='h6'>{this.state.title}</Typography>
              <IconButton
                size="small"
                onClick={this.onCancel}
              >
                <CloseIcon />
              </IconButton>
            </Grid>
            {
              this.isDirty && (
                <Box style={styles.warning}>
                  <p>Thay đổi của bạn có thể không được lưu lại!</p>
                  <IconButton
                    size="small"
                    style={{ color: 'inherit' }}
                    onClick={this.onCloseConfirmAlert}
                  >
                    <HighlightOffIcon fontSize="small" />
                  </IconButton>
                </Box>
              )
            }
          </Box>
          <Box>
            <Grid item container>
              {this.state.component}
            </Grid>
          </Box>
          <Box>
            <Grid item container justify='flex-end' style={styles.buttonGroup}>
              {
                !this.state.noCancelButton && (
                  <Grid item>
                    <Button onClick={this.onCancel}>
                      {this.state.cancelText || 'Hủy'}
                    </Button>
                  </Grid>
                )
              }
              {
                !this.state.noCancelButton && (
                  <Grid item>
                    <Button
                      variant='contained' 
                      color='primary' 
                      style={styles.buttonAccept}
                      onClick={this.onAccept}
                    >
                      { this.state.acceptText || 'Xác nhận'}
                    </Button>
                  </Grid>
                )
              }
            </Grid>
          </Box>
        </div>
      </Modal>
    );
  }

  public static setFormController<TFieldValues, TContext extends object = object>({
    control, trigger, formState
  }: IDialogControllerOptions<TFieldValues, TContext>): void {
    Dialog._current?.setState((prevState) => ({
      ...prevState,
      formControl: control,
      trigger,
      formState
    }))
  }

  public static show(option?: ModalOptions): void {
    option = option || {};
    Dialog._current?.setState((prevState) => ({
      ...prevState,
      ...option,
      visible: true 
    }));
  }

  public static forceClose(): void {
    Dialog._current?.closeModal();
  }

  public static forceSubmit(): void {
    Dialog._current?.onAccept();
  }
}

export default Dialog;