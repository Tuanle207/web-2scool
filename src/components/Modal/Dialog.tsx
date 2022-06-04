import { Component } from 'react';
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
  UseFormHandleSubmit, 
} from 'react-hook-form';
import { IDialogControllerOptions } from '../../hooks';
import styles from '../../assets/jss/components/Modal';


export interface ModalOptions {
  component?: JSX.Element;
  title?: string;
  height?: string | number;
  message?: string;
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
  handleSubmit?: UseFormHandleSubmit<any>
}

const initialState: ModalState = {
  title: 'Xác nhận tiếp tục?',
  message: undefined,
  acceptText: 'Xác nhận',
  cancelText: 'Hủy',
  noCancelButton: false,
  noAcceptButton: false,
  component: undefined,
  dirty: false,
  visible: false,
  formControl: undefined,
  handleSubmit: undefined,
  height: undefined,
  accept: () => {},
  cancel: () => {},
};

class Dialog extends Component<{}, ModalState> {
  
  private static _current?: Dialog;

  constructor(props: any) {
    super(props);
    this.state = initialState;
  }

  get formControl(): Control<any> | undefined {
    return this.state.formControl;
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

  get accept(): (data: any) => void {
    const defaultHandler = (data: any) => {};
    return this.state.accept ?? defaultHandler;
  }

  get cancel(): () => void {
    const defaultHandler = () => {};
    return this.state.cancel ?? defaultHandler;
  }

  get handleSubmit() {
    return this.state.handleSubmit;
  }

  componentDidMount() {
    Dialog._current = this;
  }

  componentWillUnmount() {
    Dialog._current = undefined;
  }

  closeModal() {
    this.setState({
      ...initialState
    });
  };

  async onAccept() {
    if (this.isDirty) {
      this.isDirty = false;
    }

    this.accept(this.formControl?._formValues || {});
    this.closeModal();
  };

  onCancel() {
    if (this.isFormDirty && !this.isDirty) {
      this.isDirty = true;
      return;
    } else {
      this.isDirty = false;
    }
    this.cancel();
    this.closeModal();
  };

  onCloseConfirmAlert() {
    if (this.isDirty) {
      this.isDirty = false;
    }
  }


  onSubmit (e: any) {
    if (e?.preventDefault) {
      e.preventDefault();
    }
    this.onAccept();
  }

  render() {
    return (
      <Modal
        open={this.state.visible}
        aria-labelledby="scool-modal"
        aria-describedby="scool-modal-global"
      >
        <form
          noValidate
          className="global-dialog-modal"
          style={!this.state.message ? styles.root : { ...styles.root, width: 400 }}
          onSubmit={this.handleSubmit ? this.handleSubmit(this.onAccept.bind(this)) : this.onSubmit.bind(this)}
        >
          <Box style={{ marginBottom: 20 }}>
            <Grid item container direction='row' justify='space-between' alignItems='center' style={styles.titleBar}>
              <Typography style={{ marginRight: '2.4rem' }} variant='h6'>{this.state.title}</Typography>
              <IconButton
                style={styles.closeButton}
                onClick={() => this.onCancel()}
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
                    onClick={() => this.onCloseConfirmAlert()}
                  >
                    <HighlightOffIcon fontSize="small" />
                  </IconButton>
                </Box>
              )
            }
          </Box>
          <Box>
            <Grid item container style={this.state.height ? {...styles.content, height: this.state.height }: styles.content}>
            {
              !!this.state.message ? (
                <p>{this.state.message}</p>
              ) :
              this.state.component
            }
            </Grid>
          </Box>
          <Box>
            <Grid 
              item
              container
              justify='flex-end'
              style={(!!this.state.component || !!this.state.message) ? {...styles.buttonGroup, ...styles.borderTop} : styles.buttonGroup}
            >
              {
                !this.state.noCancelButton && (
                  <Grid item>
                    <Button disableRipple disableTouchRipple disableFocusRipple 
                      onClick={() => this.onCancel()}>
                      {this.state.cancelText || 'Hủy'}
                    </Button>
                  </Grid>
                )
              }
              {
                !this.state.noAcceptButton && (
                  <Grid item>
                    <Button
                      variant='contained' 
                      color='primary' 
                      style={styles.buttonAccept}
                      type="submit"
                    >
                      { this.state.acceptText || 'Xác nhận'}
                    </Button>
                  </Grid>
                )
              }
            </Grid>
          </Box>
        </form>
      </Modal>
    );
  }

  public static setFormController<TFieldValues, TContext extends object = object>({
    control, handleSubmit
  }: IDialogControllerOptions<TFieldValues, TContext>): void {
    Dialog._current?.setState((prevState) => ({
      ...prevState,
      formControl: control,
      handleSubmit
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