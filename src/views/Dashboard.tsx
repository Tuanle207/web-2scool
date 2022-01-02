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
    <div style={{ flexGrow: 1 }}>
      <Grid container style={{ flex: 1 }}>
        <Grid item xs={4} sm={3} md={2}>
          <Sidebar activeKey={routes.Dashboard} />
        </Grid>
        <Grid style={{ background: '#fff' }} item container xs={8} sm={9} md={10} direction='column'>
          <Grid item style={{ flex: 1 }}>
            <Header pageName="Trang chủ" />
            <Grid item style={{ flex: 1, margin: "16px 24px" }}>
              <Paper elevation={3} variant="outlined">
                
              </Paper>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </div>
    
  );
};

export default Dashboard;