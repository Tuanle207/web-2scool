import { Component, CSSProperties } from 'react';
import { Backdrop, CircularProgress } from '@material-ui/core';
import { theme } from '../../assets/themes/theme';

const styles: {[key: string]: CSSProperties} = {
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: '#fff',
  },
};

interface IBusyBackdropState {
  busy: boolean;
} 

const initialState: IBusyBackdropState = {
  busy: false,
}

export class BusyBackdrop extends Component<{}, IBusyBackdropState> {

  private static _current?: BusyBackdrop;

  constructor(props: any) {
    super(props);
    this.state = initialState;
    this.handleOpen.bind(this);
    this.handleClose.bind(this);
  }

  componentDidMount() {
    BusyBackdrop._current = this;
  }

  componentWillUnmount() {
    BusyBackdrop._current = undefined;
  }

  handleOpen(): void {
    this.setState({busy: true});
  }

  handleClose(): void {
    this.setState({busy: false});
  }

  render() {
    return (
      <Backdrop style={styles.backdrop} open={this.state.busy}>
        <CircularProgress color="inherit" />
      </Backdrop>
    );
  }
  
  public static show(busy: boolean): void {
    if (busy) {
      BusyBackdrop._current?.handleOpen();
    } else {
      BusyBackdrop._current?.handleClose();
    }
  }
};