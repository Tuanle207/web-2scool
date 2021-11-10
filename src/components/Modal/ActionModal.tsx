import { FC, useState, useEffect, ReactFragment, ReactChild } from 'react';
import { Box, Grid, IconButton, Modal, ModalProps, Typography } from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import WarningIcon from '@material-ui/icons/Warning';
import modalStyles from '../../assets/jss/components/Modal';

export interface IActionModalProps extends Omit<ModalProps, "children"> { 
  title?: string;
  confirmBeforeExit?: boolean;
  onRequestClose: () => void;
  children: ReactFragment | ReactChild
}

const ActionModal: FC<IActionModalProps> = ({
  title,
  confirmBeforeExit,
  open,
  onRequestClose,
  children
}) => {


  const [ warningNotified, setWarningNotified ] = useState(false);

  useEffect(() => {
    if (confirmBeforeExit && !warningNotified) {
      setWarningNotified(true);
    } else if (!confirmBeforeExit) {
      setWarningNotified(false);
    }
  }, [ confirmBeforeExit, warningNotified ]);

  const requestClose = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    if (confirmBeforeExit && !warningNotified) {
      return;
    }
    onRequestClose();
  };

  return (
    <Modal
      open={open}
      aria-labelledby="scool-modal"
      aria-describedby="scool-modal-global"
    >
      <div style={modalStyles.root}>
        <Box>
          <Grid item container direction='row' justify='space-between' alignItems='center' style={modalStyles.titleBar}>
            <Typography variant='h6'>{ title }</Typography>
            <IconButton onClick={requestClose} size="small" >
              <CloseIcon />
            </IconButton>
          </Grid>
        </Box>
        <Box style={{ marginTop: 8 }}>
        {
          open && confirmBeforeExit && (
            <Box style={modalStyles.warning}>
              <WarningIcon fontSize="small" style={{ marginRight: 4 }} />
              <p>Nhấn lưu để lưu lại kết quả!</p>
            </Box>
          )
        }
        {
          children
        }
        </Box>
      </div>
    </Modal>
  );
};

export default ActionModal;