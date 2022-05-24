import { Button, Grid, Typography } from '@material-ui/core';
import { useHistory } from 'react-router';
import Header from '../components/Header';
import { routes } from '../routers/routesDictionary';

const ErrorPage = () => {

  const history = useHistory();

  const onHomeNavigate = () => {
    history.replace(routes.Dashboard);
  };

  return (
    <Grid style={{ background: '#fff', flexGrow: 1 }} item container direction='column'>
      <Grid item>
        <Header hiddenSearchBar/>
      </Grid>
      <Grid container item direction="column" alignItems="center" justify="center" style={{ flexGrow: 1 }}>
        <Typography>
          Bạn không có quyền truy cập vào trang này.
        </Typography>
        <Button variant="text" color="primary" onClick={onHomeNavigate}>
          Quay về trang chủ
        </Button>
      </Grid>
    </Grid>
  );
};

export default ErrorPage;