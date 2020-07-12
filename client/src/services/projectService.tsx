import axios from 'axios';

class ProjectService {
  static getSlides(guid: string) {
    return axios.get(process.env.REACT_APP_API_URL + "/project/slides/" + guid);
  }

  static updateProject(projectId: Number, data: object) {
    return axios.put(process.env.REACT_APP_API_URL + "/project/update/" + projectId, data);
  }

  static projectUpload(data: FormData) {
    return axios.post(process.env.REACT_APP_API_URL + "/project/upload", data);
  }
}

export default ProjectService;