import { Class } from './Class';
import { User } from './User';

export namespace LrReport {

  export interface LRReportDto {
    id: string;
    totalPoint: number;
    absenceNo: number;
    class: Class.ClassForSimpleListDto;
    attachedPhotos: string[];
    status: string;
    creationTime: Date;
    creatorId: string;
    creator: User.UserForSimpleListDto;
  }


  export interface CreateUpdateLRReportDto {
    classId: string;
    photo: File | null;
    absenceNo: number;
    totalPoint: number;
  }

}