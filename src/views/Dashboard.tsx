import { useEffect } from 'react';
import { Container, Grid, Paper, Typography } from '@material-ui/core';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import { routes } from '../routers/routesDictionary';

const Dashboard = () => {

  useEffect(() => {
    document.title = "Trang chủ";
  }, []);

  return (
    <div style={{ height: '100%' }}>
      <Grid container style={{ height: '100%' }}>
        <Grid item xs={4} sm={3} md={2}>
          <Sidebar activeKey={routes.Dashboard} />
        </Grid>
        <Grid style={{ background: '#fff', flexGrow: 1 }} item container xs={8} sm={9} md={10} direction='column'>
          <Grid item >
            <Header
              pageName="Trang chủ"
            />
          </Grid>
          <Grid item container direction='column' style={{ flex: 1, minHeight: 0, flexWrap: 'nowrap', background: "#e8e8e8" }}>
            <Paper elevation={3} variant="outlined" style={{ height: "100%", margin: "16px 24px" }}>

            </Paper>
          </Grid>
        </Grid>
      </Grid>
    </div>
    
  );
};

export default Dashboard;