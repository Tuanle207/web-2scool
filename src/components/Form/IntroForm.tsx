import { FC } from 'react';
import { Button, Grid, Container, Box, Typography } from '@material-ui/core';
import useIntroFormStyles from '../../assets/jss/components/Form/useIntroFormStyles';

interface IntroFormProps { }

const IntroForm: FC<IntroFormProps> = () => {

  const styles = useIntroFormStyles();

  return (
    <Container className={styles.formContainer}>
      <Grid container className={styles.wrapper}  alignItems={'center'}>
        <Box>
          <Box className={styles.welcome}>
            <Typography variant='h4' className={styles.welcomeText}>Welcome to 2Scool</Typography>
          </Box>
          <p className={styles.descriptionText}>2Scool là 1 nền tảng quản lý nề nếp học sinh dành cho các trường THPT, THCS. 2Scool cung cấp giải pháp hiệu quả, tối ưu cho việc số hóa công tác quản lý nề nếp, mang lại sự tiện lợi và nhanh chóng trong công tác quản lý.</p>
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