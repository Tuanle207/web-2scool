import { FC, ReactChild } from 'react';
import { Badge, Box, Button, Grid, Tooltip } from '@material-ui/core';
import { ReactComponent as FilterIcon } from '../../assets/img/filter.svg';
import usePageTitleBarStyles from '../../assets/jss/components/PageTitleBar/usePageTitleBarStyles';

interface Props {
  title: string,
  onMainButtonClick?: () => void;
  onOptionsButtonClick?: () => void;
  filterComponent?: ReactChild;
  filterCount?: number;
}

const PageTitleBar: FC<Props> = ({
  title,
  onMainButtonClick,
  onOptionsButtonClick,
  filterComponent,
  filterCount = 0
}) => {

  const classes = usePageTitleBarStyles();

  return (
    <Grid item container alignItems={'center'} className={classes.container}>
      <Tooltip title="Bộ lọc" style={{ marginRight: 16 }}>
        <Badge badgeContent={filterCount} color="primary" >
          <FilterIcon fontSize="small" />
        </Badge>
      </Tooltip>
      <Box className={classes.filter}>
      {
        filterComponent
      }
      </Box>
      <Box style={{ marginLeft: "auto" }}>
        <Button variant="contained"
          color={'primary'}
          onClick={onMainButtonClick}
        >
          Thêm
        </Button>
      </Box>
    </Grid>
  );
};

export default PageTitleBar;