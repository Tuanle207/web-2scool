import React from 'react';
import { Box, Container, TextField, Select, InputLabel, FormControl, MenuItem } from '@material-ui/core';
import { Class, Course, Grade, Teacher } from '../../common/interfaces';
import { useDataValidator } from '../../hooks';
import { ClassesService, CoursesService, GradesService, TeachersService } from '../../common/api';
import ActionModal from '.';

const CreateOrUpdateClassRequest = ({id}: {id?: string}) => {

  const [data, setData] = React.useState<Class.CreateUpdateClassDto>({
    name: '',
    courseId: '',
    gradeId: '',
    formTeacherId: '',
  });
  const [courses, setCourses] = React.useState<Course.CourseDto[]>([]);
  const [grades, setGrades] = React.useState<Grade.GradeDto[]>([]);
  const [teachers, setTeachers] = React.useState<Teacher.TeacherForSimpleListDto[]>([]);
  const {errors, validate, getError} = useDataValidator();

  React.useEffect(() => {

    const initData = async () => {
      const coursesRes = await CoursesService.getAllCourses({});
      setCourses(coursesRes.items);
      const gradesRes = await GradesService.getAllGrades({});
      setGrades(gradesRes.items);
      const teachersRes = await TeachersService.getAllTeachersSimpleList();
      setTeachers(teachersRes);
      if (id) {
        const classRes = await ClassesService.getClassById(id);
        setData({
            name: classRes.name || '',
            courseId: classRes.courseId || '',
            gradeId: classRes.gradeId || '',
            formTeacherId: classRes.formTeacherId || '',
        })
      }

    };
   
    initData();
  }, [id]);

  React.useEffect(() => {
    console.log({courses})
  }, [courses]);

  React.useEffect(() => {
    ActionModal.setData({
      data,
      error: errors.length > 0 ? {
        error: true,
        msg: errors[0].msg
      } : undefined
    });
  }, [data]);


  return (
    <form style={{padding: '20px 0'}}>
      <Container>
        <Box style={{marginBottom: '10px'}}>
          <TextField 
            // {...getError('mô tả')}
            id='create-class-name' 
            label='Tên lớp'
            autoComplete='off'
            style={{width: '40ch'}}
            value={data.name}
            onChange={e => setData(prev => ({...prev, name: e.target.value}))}

          />
        </Box>
        <Box style={{marginBottom: '10px'}}>
          <FormControl fullWidth>
            <InputLabel htmlFor="create-class-course">Khóa học</InputLabel>
            <Select
              // native
              value={data.courseId}
              onChange={e => setData(prev => ({...prev, courseId: (e.target.value as string)}))}
              inputProps={{
                name: 'class-course',
                id: 'create-class-course',
              }}
            >
            {
              courses.map(el => (<MenuItem value={el.id}>{el.name}</MenuItem>))
            }
            </Select>
          </FormControl>
        </Box>
        <Box style={{marginBottom: '10px'}}>
          <FormControl fullWidth>
            <InputLabel htmlFor="create-class-grade">Khối</InputLabel>
            <Select
              // native
              value={data.gradeId}
              onChange={e => setData(prev => ({...prev, gradeId: (e.target.value as string)}))}
              inputProps={{
                name: 'class-grade',
                id: 'create-class-grade',
              }}
            >
            {
              grades.map(el => (<MenuItem value={el.id}>{el.displayName}</MenuItem>))
            }
            </Select>
          </FormControl>
        </Box>
        <Box style={{marginBottom: '10px'}}>
          <FormControl fullWidth>
            <InputLabel htmlFor="create-class-teacher">Giáo viên</InputLabel>
            <Select
              // native
              value={data.formTeacherId}
              onChange={e => setData(prev => ({...prev, formTeacherId: (e.target.value as string)}))}
              inputProps={{
                name: 'class-teacher',
                id: 'create-class-teacher',
              }}
            >
            {
              teachers.map(el => (<MenuItem value={el.id}>{el.name}</MenuItem>))
            }
            </Select>
          </FormControl>
        </Box>
      </Container>
    </form>
  );
};

export default CreateOrUpdateClassRequest;