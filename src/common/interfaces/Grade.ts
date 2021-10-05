
export namespace Grade {
  
  export interface GradeDto {
    id: string;
    name: string;
    displayName: string;
    description: string;
  }

  export interface CreateUpdateGradeDto {
    displayName: string;
    description: string;
  }
}