export namespace Teacher {
  
  export interface TeacherDto {
    id: string;
    name: string;
    dob: Date;
    email: string;
    phoneNumber: string;
  }

  export interface TeacherForSimpleListDto {
    id: string;
    name: string;
  }

  export interface CreateUpdateTeacherDto {
    name: string ;
    dob: Date ;
    email: string ;
    phoneNumber: string ;
  }
}