import { Teacher } from './Teacher';
import { Course } from './Course';
import { Grade } from './Grade';


export namespace Class {

  export interface ClassDto {
    id: string;
    name: string;
    courseId: string;
    course: Course.CourseDto;
    gradeId: string;
    grade: Grade.GradeDto;
    formTeacherId: string;
    formTeacher: Teacher.TeacherDto;
    students: [];
    noStudents: number;
  }

  export interface ClassForListDto {
    id: string;
    name: string;
    courseId: string;
    course: Course.CourseDto;
    gradeId: string;
    grade: Grade.GradeDto;
    formTeacherId: string;
    formTeacher: Teacher.TeacherDto;
    noStudents: number;
  }

  export interface ClassForSimpleListDto {
    id: string;
    name: string;
  }

  export interface ClassForStudentDto {
    id: string;
    name: string;
    courseId: string;
    formTeacherId: string;
  }

  export interface CreateUpdateClassDto {
    name: string;
    courseId: string;
    gradeId: string;
    formTeacherId: string;
  }
}