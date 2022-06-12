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

  export interface LrClassRanking {
    ranking: number;
    classId: string;
    className: string;
    formTeacherName: string;
    totalAbsence: number;
    lrPoints: number;
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

  export interface PieChartStatDto {
    items: PieChartStat[];
  }

  export interface PieChartStat {
    name: string;
    value: number;
  }

  export interface BarChartStatDto {
    items: BarChartStat[];
  }

  export interface BarChartStat {
    name: string;
    points: number;
    faults: number;
  }

  export interface ClassFaultDetail {
    id: string;
    regulationId: string;
    regulationName: string;
    criteriaName: string;
    penaltyPoints: number;
    creationTime: Date;
    studentNames: string;
  }

  export interface FaultDetail {
    id: string;
    penaltyPoints: number;
    creationTime: string;
    studentNames: string;
    className: string;
  }

  export interface StudentFaultDetail {
    id: string;
    regulationName: string;
    criteriaName: string;
    penaltyPoints: number;
    count: number;
    creationTime: string | null;
    className: string;
  }


}