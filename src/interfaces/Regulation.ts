
export namespace Regulation {

  export interface CriteriaForSimpleList  {
    id: string;
    name: string;
  }

  export interface RegulationForSimpleListDto {
    id: string;
    name: string;
    point: number;
    criteriaId: string;
    criteria: CriteriaForSimpleList;
  }
}