import ENV from '../../config/env';

const Endpoint = {
  ImportStudentsData: () => `/api/app/data-import/import-students-data-v1`,
  ImportTeachersData: () => `/api/app/data-import/import-teachers-data`,
  ImportClassesData: () => `/api/app/data-import/import-classes-data`,
  ImportRegulationsData: () => `/api/app/data-import/import-regulations-data`,
  ImportCriteriasData: () => `/api/app/data-import/import-criterias-data`,

  GetTemplateTeacherImport: () => `${ENV.host}/file/teacher-import.xlsx`,
  GetTemplateClassImport: () => `${ENV.host}/file/class-import.xlsx`,
  GetTemplateStudentImport: () => `${ENV.host}/file/student-import.xlsx`,
  GetTemplateRegulationImport: () => `${ENV.host}/file/regulation-import.xlsx`,
  GetTemplateCriteriaImport: () => `${ENV.host}/file/criteria-import.xlsx`,
};

export default Endpoint;