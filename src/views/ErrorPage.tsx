import React from 'react';
import { Container, Grid, Typography } from '@material-ui/core';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';

const ErrorPage = () => {

  React.useEffect(() => {
    // console.log('hello from ErrorPage');
  }, []);

  return (
    <div style={{ flexGrow: 1 }}>
      <Grid container style={{ flex: 1 }}>
        <Grid item xs={4} sm={3} md={2}>
          <Sidebar />
        </Grid>
        <Grid style={{ background: '#fff' }} item container xs={8} sm={9} md={10} direction='column'>
          <Grid item style={{ flex: 1 }}>
            <Header />
            <Grid item style={{ flex: 1 }}>
              <Container style={{display: 'flex', justifyContent: 'center', justifyItems: 'center'}}>
                <Typography>
                  You have no permisison to access this page!
                </Typography>
              </Container>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </div>
    
  );
};

export default ErrorPage;