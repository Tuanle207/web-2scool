import { Class } from './Class';
import { Regulation } from './Regulation';
import { Student } from './Student';
import { User } from './User';


export namespace DcpReport {

  export interface DcpReportDto {
    id: string;
    status: string;
    creationTime: Date;
    creatorId: string;
    creator: User.UserForSimpleListDto;
    dcpClassReports: DcpClassReportDto[]
  }

  export interface DcpClassReportDto {
    id: string;
    dcpReportId: string;
    classId: string;
    class: Class.ClassForSimpleListDto;
    penaltyTotal: number;
    faults: DcpClassReportItemDto[]
  }

  export interface DcpClassReportItemDto {
    id: string;
    dcpClassReportId: string;
    regulationId: string;
    regulation: Regulation.RegulationForSimpleListDto;
    relatedStudents: DcpStudentReportDto[]
  }

  export interface DcpStudentReportDto {
    id: string;
    dcpClassReportItemId: string;
    studentId: string;
    student: Student.StudentDto;
  }

  export interface CreateUpdateDcpReportDto {
    dcpClassReports: CreateUpdateDcpClassReportDto[]
  }

  export interface CreateUpdateDcpClassReportDto {
    classId: string;
    faults: CreateUpdateDcpClassReportItemDto[];
  }

  export interface CreateUpdateDcpClassReportItemDto {
    regulationId: string;
    relatedStudentIds: string[];
  }

  export interface LRReportDto {
    id: string;
    totalPoint: number;
    absenceNo: number;
    attachedPhotos: string[];
    status: string;
    class: Class.ClassForSimpleListDto;
    creationTime: Date;
    creatorId: string;
  }

  export interface CreateUpdateLRReportDto {
    classId: string;
    photo: File;
    absenceNo: number;
    totalPoint: number;
  }

}