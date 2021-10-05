import { Button, Grid, Container, Box, Typography } from '@material-ui/core';
import React from 'react';
import useIntroFormStyles from '../../assets/jss/components/Form/useIntroFormStyles';

interface Props {
  history: any;
}

const IntroForm: React.FC<Props> = ({ history }) => {

  const styles = useIntroFormStyles();

  return (
    <Container className={styles.formContainer}>
      <Grid container className={styles.wrapper}  alignItems={'center'}>
        <Box>
          <Typography variant='h4' className={styles.welcomeText}>Welcome to 2SCOOL</Typography>
          <p className={styles.descriptionText}>2SCOOL là 1 nền tảng quản lí nề nếp học sinh dành cho các trường THPT, THCS. 2SCOOL cung cấp giải pháp hiệu quả, tối ưu cho việc số hóa công tác quản lí nề nếp, mang lại sự tiện lợi mà nhanh chóng trong công tác quản lí.</p>
          <Button
            variant='outlined'
            color='primary'
            type='submit'
            disableElevation
            className={styles.button}
          >
            Tìm hiểu thêm
          </Button>
        </Box>
      </Grid>
    </Container>
  );
};

export default IntroForm;