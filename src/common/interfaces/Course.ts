
export namespace Course {
  export interface CourseDto {
    id: string;
    name: string;
    description: string;
    startTime: Date;
    finishTime: Date;
  }
  
  export interface CreateUpdateCourseDto {
    name: string;
    description: string;
    startTime: Date;
    finishTime: Date;
  }
}

