import { Course, Class, Grade, Teacher, Student } from './common/interfaces';

const courses: Course.CourseDto[] = [
  {
    id: '1',
    name: 'Khóa học 2020-2021',
    description: 'Khóa học cho năm học 2020-2021',
    startTime: new Date(2020, 8, 5),
    finishTime: new Date(2021, 6, 1)
  }
];

const grades: Grade.GradeDto[] = [
  {
    id: '1',
    name: '10',
    displayName: 'Khối 10',
    description: 'Nhóm lớp cho học sinh lớp 10',
  },
  {
    id: '2',
    name: '11',
    displayName: 'Khối 11',
    description: 'Nhóm lớp cho học sinh lớp 11',
  },
  {
    id: '3',
    name: '10',
    displayName: 'Khối 12',
    description: 'Nhóm lớp cho học sinh lớp 12',
  }
];

const teachers: Teacher.TeacherDto[] = [
  {
    id: '1',
    name: 'Nguyễn Xuân Vịnh',
    dob: new Date(1980, 1, 1),
    email: 'nxvinh@gmail.com',
    phoneNumber: '01224578227'
  },
  {
    id: '2',
    name: 'Đào Văn Vịnh',
    dob: new Date(1980, 1, 1),
    email: 'dvvu@gmail.com',
    phoneNumber: '01224578227'
  },
  {
    id: '3',
    name: 'Lê Văn Ba',
    dob: new Date(1980, 1, 1),
    email: 'lvba@gmail.com',
    phoneNumber: '01224578227'
  },
  {
    id: '4',
    name: 'Nguyễn Xuân Tú',
    dob: new Date(1980, 1, 1),
    email: 'nxtu@gmail.com',
    phoneNumber: '01224578227'
  },
  {
    id: '5',
    name: 'Lê Xuân Tùng',
    dob: new Date(1980, 1, 1),
    email: 'lxtung@gmail.com',
    phoneNumber: '01224578227'
  }
];

const students: Student.StudentDto[] = Array.from(new Array(30), i => i + 1).map((_, i) => {

  return {
    id: `${i + 1}`,
    classId: `${Math.floor(i / 10) + 1}`,
    name: `Học sinh ${i + 1}`,
    class: {} as Class.ClassForListDto,
    dob: new Date(2000, 1, 1),
    parentPhoneNumber: '01662752532'
  }
});

const classes: Class.ClassDto[] = [
  {
    id: '1',
    name: 'Lớp 10A1',
    courseId: '1',
    course: courses.find(el => el.id === '1') || {} as Course.CourseDto,
    gradeId: '1',
    grade: grades.find(el => el.id === '1') || {} as Grade.GradeDto,
    formTeacherId: '1',
    formTeacher: teachers.find(el => el.id === '1') || {} as Teacher.TeacherDto,
    noStudents: 10,
    students: []
  },
  {
    id: '1',
    name: 'Lớp 11A1',
    courseId: '1',
    course: courses.find(el => el.id === '1') || {} as Course.CourseDto,
    gradeId: '2',
    grade: grades.find(el => el.id === '2') || {} as Grade.GradeDto,
    formTeacherId: '2',
    formTeacher: teachers.find(el => el.id === '2') || {} as Teacher.TeacherDto,
    noStudents: 10,
    students: []
  },
  {
    id: '1',
    name: 'Lớp 12A1',
    courseId: '1',
    course: courses.find(el => el.id === '1') || {} as Course.CourseDto,
    gradeId: '3',
    grade: grades.find(el => el.id === '3') || {} as Grade.GradeDto,
    formTeacherId: '3',
    formTeacher: teachers.find(el => el.id === '3') || {} as Teacher.TeacherDto,
    noStudents: 10,
    students: []
  },
];

const DATA = {
  courses,
  grades,
  classes,
  students,
  teachers
};

export default DATA;