import React from 'react';
import { Container, Grid } from '@material-ui/core';
import { DcpReport } from '../../common/interfaces';
import FaceIcon from '@material-ui/icons/Face';

const StudentList = ({students}: {students: DcpReport.DcpStudentReportDto[]}) => {

  return (
    <Container style={{padding: '20px 0'}}>
      {
        students.map((el) => (
          <Grid key={el.studentId} container direction='row' alignItems='center' style={{marginBottom: 8}}>
            <FaceIcon fontSize='small' />
            <p style={{marginLeft: 8}}>{el.student.name}</p>
          </Grid>
        ))
      }
      {
        students.length === 0 && (
          <Grid container justify='center' alignItems='center'>
            <p>Không có học sinh nào</p>
          </Grid>
        )
      }
    </Container>
  );
};

export default StudentList;