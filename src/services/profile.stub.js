import axios from 'axios';
import AxiosMockAdapter from 'axios-mock-adapter';
import { Override } from '@di';

import ProfileService, { PROFILE_SERVICE_ID } from './profile.js'; // always use '.js' extension otherwise this module will be required.

export { PROFILE_SERVICE_ID };

@Override(PROFILE_SERVICE_ID)
export default class ProfileStubService extends ProfileService {
  getProfile () {
    let axiosMock = new AxiosMockAdapter(axios);
    axiosMock.onGet('/api/profile').replyOnce(200, {
      firstName: 'John',
      lastName: 'Doe',
      username: 'john.doe',
      id: '123'
    });

    return super.getProfile().finally(() => axiosMock.restore());
  }
}
