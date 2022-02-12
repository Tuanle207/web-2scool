import { Util } from './Util';

export namespace Stats {

  export interface OverallClassRanking {
    ranking: number;
    classId: string;
    className: string;
    formTeacherName: string;
    totalAbsence: number;
    faults: number;
    penaltyPoints: number;
    lRPoints: number;
    dcpPoints: number;
    rankingPoints: number;
  }
  export interface DcpClassRanking {
    ranking: number;
    classId: string;
    className: string;
    formTeacherName: string;
    faults: number;
    penaltyPoints: number;
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

  export interface LineChartStat {
    classId: string;
    penaltyPoint: number;
    faults: number;
  }

  export interface LineChartStatDto {
    items: Util.IObject<LineChartStat[]>;
  }
}