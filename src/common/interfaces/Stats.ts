export namespace Stats {

  export interface DcpClassRanking {
    ranking: number;
    classId: string;
    className: string;
    formTeacherName: string;
    faults: number;
    enaltyPoints: number;
    totalPoints: number;
  }

  export interface DcpClassFault {
    classId: string;
    className: string;
    formTeacherName: string;
    faults: number;
    penaltyPoints: number;
  }
  
  export interface CommonDcpFault {
    id: string;
    name: string;
    criteriaName: string;
    faults: number;
  }

  export interface StudentWithMostFaults {
    id: string;
    studentName: string;
    className: string;
    faults: number;
  }
}