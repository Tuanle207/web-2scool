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
    `/api/app/courses/is-name-already-used?id=${id}&name=${name}`,
  MarkAsActiveCourse: (id: string) =>
    `/api/app/courses/activate/${id}`,
  HasActiveCourse: () =>
    `/api/app/courses/has-active-course`
};

export default Endpoint;