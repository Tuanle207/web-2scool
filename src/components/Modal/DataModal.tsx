import { FC, useState, useEffect } from 'react';
import { Box, Grid, IconButton, Typography } from '@material-ui/core';
import ReactModal from 'react-modal';
import CloseIcon from '@material-ui/icons/Close';
import WarningIcon from '@material-ui/icons/Warning';
import useModalStyles from '../../assets/jss/components/Modal/useModalStyles';

export interface IDataModalProps extends ReactModal.Props { 
  title?: string;
  confirmBeforeExit?: boolean;
  onRequestClose: () => void;
}

const DataModal: FC<IDataModalProps> = ({
  title,
  confirmBeforeExit,
  onRequestClose,
  children,
  isOpen,
  ...rest
}) => {

  const styles = useModalStyles();

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
    <ReactModal
      ariaHideApp={false}
      className={styles.root}
      isOpen={isOpen}
      {...rest}
    >
      <Box>
          <Grid item container direction='row' justify='space-between' alignItems='center' className={styles.titleBar}>
            <Typography variant='h6'>{ title }</Typography>
            <IconButton onClick={requestClose} size="small" >
              <CloseIcon />
            </IconButton>
          </Grid>
        </Box>
        <Box style={{ marginTop: 8 }}>
        {
          warningNotified && (
            <Box className={styles.warning}>
              <WarningIcon fontSize="small" style={{ marginRight: 4 }} />
              <p>Nhấn lưu để lưu lại kết quả!</p>
            </Box>
          )
        }
        {
          isOpen && children
        }
        </Box>
    </ReactModal>
  );
};

export default DataModal;