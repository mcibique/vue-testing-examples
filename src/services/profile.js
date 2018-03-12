import axios from 'axios';
import { Register } from '@di';

export const PROFILE_SERVICE_ID = Symbol('profileService');

@Register(PROFILE_SERVICE_ID)
export default class ProfileService {
  getProfile () {
    return axios.get('/api/profile').then(response => response.data);
  }
}
