import axios from 'axios';

class PresentationService {
  static updatePresentation(presentationId: Number, data: object) {
    return axios.put(process.env.REACT_APP_API_URL + "/presentation/update/" + presentationId, data);
  }
}

export default PresentationService;