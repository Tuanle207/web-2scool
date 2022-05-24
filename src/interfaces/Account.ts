import { Class } from './Class';

export namespace Account {

  export interface SimpleAccountDto {
    id: string;
    name: string;
    classDisplayName: string;
    photo: string;
    email: string;
    phoneNumber: string;
    class: Class.ClassForSimpleListDto;
    isStudent: boolean;
    isTeacher: boolean;
  }

  export interface CurrentAccountDto {
    isAuthenticated: boolean;
    hasAccount: boolean;
    isStudent: boolean;
    isTeacher: boolean;
    id: string;
    userId: string;
    displayName: string;
    email: string;
    phoneNumber: string;
    dob?: Date;
    avatar: string;
    classId: string;
    studentId: string;
    teacherId: string;
    creationTime: Date;
    creatorId: string;
  }
}