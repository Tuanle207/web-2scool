import { FC } from 'react';
import { Box, Button, Grid, Typography } from '@material-ui/core';
import MoreHorizIcon from '@material-ui/icons/MoreHoriz';
import usePageTitleBarStyles from '../../assets/jss/components/PageTitleBar/usePageTitleBarStyles';

interface Props {
  title: string,
  onMainButtonClick?: Function;
  onOptionsButtonClick?: Function;
}

const PageTitleBar: FC<Props> = ({ title, onMainButtonClick, onOptionsButtonClick }) => {

  const classes = usePageTitleBarStyles();

  return (
    <Grid item container justify={'space-between'} alignItems={'center'} className={classes.container}>
      <Typography variant='h5' className={classes.title} display='inline'>{ title }</Typography>
      <Box>
        <Button variant={'contained'} className={`${classes.button} ${classes.buttonMoreOptions}`}
          onClick={() => onOptionsButtonClick && onOptionsButtonClick()}>
          <MoreHorizIcon />
        </Button>
        <Button variant={'contained'}  color={'primary'} className={`${classes.button}`}
          onClick={() => onMainButtonClick && onMainButtonClick()}>
          Thêm
        </Button>
      </Box>
    </Grid>
  );
};

export default PageTitleBar;