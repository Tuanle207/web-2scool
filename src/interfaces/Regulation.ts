
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

  export interface CriteriaDto {
    id: string;
    displayName: string;
    description: string;
  }

  export interface RegulationDto {
    id: string;
    name: string;
    displayName: string;
    point: number;
    criteriaId: string;
    criteria: CriteriaDto;
    isActive: boolean;
    creationTime: Date;
  }
}