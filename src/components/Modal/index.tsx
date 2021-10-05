import React from 'react';
import { Box, Button, Grid, IconButton, Modal, Typography, WithStyles, withStyles } from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import modalStyles from '../../assets/jss/components/Modal';

/**
 * used as paramater passes into SHOW modal method
 */
export interface ModalOptions {
  component?: JSX.Element;
  title?: string;
  onAccept?: Function;
  onCancel?: Function;
  onClose?: Function;
  acceptText?: string;
  cancelText?: string;
  noCancelButton?: boolean;
  noAcceptButton?: boolean
}

/**
 * Data in Modal's child component
 */
export interface ModalData {
  data?: any;
  error?: ModalDataError;
}

/**
 * Data error in Modal's child component
 */
export interface ModalDataError {
  error: boolean;
  msg: string;
}

/**
 * Modal state data
 */
interface ModalState extends ModalOptions {
  visible: boolean;
  data: ModalData;
}

// initial state
const initialState = {
  title: 'Xác nhận tiếp tục?',
  acceptText: 'Xác nhận',
  cancelText: 'Hủy',
  noCancelButton: false,
  noAcceptButton: false,
  component: undefined,
  data: {},
  visible: false
}


class ActionModal extends React.Component<{}, ModalState> {
  
  private static _self: ActionModal;

  constructor(props: any) {
    super(props);
    this.state = initialState;
  }

  componentDidMount() {
    ActionModal._self = this;
  }

  closeModal = () => {
    this.setState({
      ...initialState
    });
  };

  acceptHandler = () => {
    // 1. check error
    if (this.hasError()) {
      return;
    }
    // 2. async function (API call) or non-async function (non API Call)
    const promise = this.state.onAccept && this.state.onAccept(this.state.data.data);

    // Async
    if (promise instanceof Promise) {
      // 3. Set loading state - disable button 
      this.setState({...this.state, noAcceptButton: true, noCancelButton: true});

      // 4. call API and resolve/reject/finally response
      promise
        .then(resolve => { // call API ok -> resolve
          this.state.onClose && this.state.onClose(); // optional
          this.setState({ ...this.state, noCancelButton: false, noAcceptButton: false});
        })
        .catch(err => { // failed -> reject, handler error
          console.log('Đã có lỗi xảy ra', {err});
        })
        .finally(() => { // finally
          // 5. Close modal
          this.closeModal();
        });
    } 
    // Non-async
    else {
      this.state.onClose && this.state.onClose(); // optional
      this.closeModal();
    }
  };

  cancelHandler = () => {
    this.state.onCancel && this.state.onCancel();
    this.state.onClose && this.state.onClose();
    this.closeModal();
  };

  hasError = () => {
    if (this.state.data.error) {
      console.log('Đã xảy ra lỗi', {error: this.state.data.error})
      return true;
    }
    return false;
  }

  render() {
    return (
      <Modal
        open={this.state.visible}
        aria-labelledby="scool-modal"
        aria-describedby="scool-modal-global"
      >
        <div style={modalStyles.root}>
          <Box>
            <Grid item container direction='row' justify='space-between' alignItems='center' style={modalStyles.titleBar}>
              <Typography variant='h6'>{this.state.title}</Typography>
              <IconButton onClick={this.closeModal}>
                <CloseIcon />
              </IconButton>
            </Grid>
          </Box>
          <Box>
            <Grid item container>
              {this.state.component}
            </Grid>
          </Box>
          <Box>
            <Grid item container justify='flex-end' style={modalStyles.buttonGroup}>
              <Grid item>
                <Button onClick={this.cancelHandler}>
                  {this.state.cancelText || 'Hủy'}
                </Button>
              </Grid>
              <Grid item>
                <Button 
                  variant='contained' 
                  color='primary' 
                  style={modalStyles.buttonAccept}
                  onClick={this.acceptHandler}>
                  {this.state.noCancelButton ? 'Đang xử lý...' : this.state.acceptText || 'Xác nhận'}
                </Button>
              </Grid>
            </Grid>
          </Box>
        </div>
      </Modal>
    );
  }

  public static setData(data?: ModalData) {
    data = data || {};
    ActionModal._self.setState(prev => ({
      ...initialState,
      ...prev,
      data: data!
    }));
  }

  public static show(option?: ModalOptions) {
    option = option || {};
    ActionModal._self.setState({
      ...initialState,
      ...option,
      visible: true 
    });
  }

  public static forceClose() {
    ActionModal._self.closeModal();
  }
}

export default ActionModal;