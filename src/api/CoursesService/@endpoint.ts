const Endpoint = {
  GetCourseById: (id: string) =>
    `/api/app/courses/${id}`,
  GetAllCourses: () => 
    `/api/app/courses/paging`,
  CreateCourse: () =>
    `/api/app/courses`,
  UpdateCourse: (id: string) =>
    `/api/app/courses/${id}`,
  RemoveCourse: (id: string) =>
    `/api/app/courses/${id}`,
  IsNameAlreadyUsed: (id: string, name: string) =>
    `/api/app/courses/IsNameAlreadyUsed?id=${id}&name=${name}`,
};

export default Endpoint;