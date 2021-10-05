import React from 'react';
import { Container, Grid, Typography } from '@material-ui/core';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';

const Dashboard = () => {

  React.useEffect(() => {
    console.log('hello from dashboard');
  }, []);

  return (
    <div style={{ flexGrow: 1 }}>
      <Grid container style={{ flex: 1 }}>
        <Grid item xs={4} sm={3} md={2}>
          <Sidebar activeKey={'dashboard'} />
        </Grid>
        <Grid style={{ background: '#fff' }} item container xs={8} sm={9} md={10} direction='column'>
          <Grid item style={{ flex: 1 }}>
            <Header />
            <Grid item style={{ flex: 1 }}>
              <Container style={{display: 'flex', justifyContent: 'center', justifyItems: 'center'}}>
                <Typography>
                  Not implemented yet!
                </Typography>
              </Container>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </div>
    
  );
};

export default Dashboard;