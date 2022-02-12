import { Class } from './Class';
import { User } from './User';

export namespace TaskAssignment {

  export interface CreateUpdateTaskAssignmentDto {
    items: ClassAssignedItem[];
    taskType: string;
  }

  export interface ClassAssignedItem {
    assigneeId: string;
    classId: string;
    startTime: Date;
    endTime: Date;
  }

  export interface TaskAssignmentFilterDto {
    className?: string;
    assigneeName?: string;
    taskType: string;
  }

  export interface UserProfleForTaskAssignmentDto {
    id: string;
    name: string;
    class: Class.ClassForSimpleListDto;
    phoneNumber: string;
  }

  export interface TaskAssignmentDto {
    id: string;
    assignee: UserProfleForTaskAssignmentDto;
    classAssigned: Class.ClassForSimpleListDto;
    taskType: string;
    startTime: Date;
    endTime: Date;
    creationTime: Date;
    creatorId: string;
    creator: User.UserForSimpleListDto;
  }

  export interface TaskAssignmentForUpdateDto {
    id: string;
    assigneeId: string;
    classAssignedId: string;
    taskType: string;
    startTime: Date;
    endTime: Date;
  }
}