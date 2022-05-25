
export namespace Course {
  export interface CourseDto {
    id: string;
    name: string;
    description: string;
    startTime: Date;
    finishTime: Date;
    isActive: boolean;
  }
  
  export interface CreateUpdateCourseDto {
    name: string;
    description: string;
    startTime: Date;
    finishTime: Date;
  }
}

