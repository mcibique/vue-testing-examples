import axios from 'axios';

export default class ProfileService {
  getProfile () {
    return axios.get('/api/profile').then(response => response.data);
  }
}
