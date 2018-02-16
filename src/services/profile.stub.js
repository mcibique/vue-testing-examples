import axios from 'axios';
import AxiosMockAdapter from 'axios-mock-adapter';

import ProfileService from './profile.js'; // always use '.js' extension otherwise this module will required.

export default class ProfileStubService extends ProfileService {
  getProfile () {
    let axiosMock = new AxiosMockAdapter(axios);
    axiosMock.onGet('/api/profile').replyOnce(200, {
      firstName: 'FirstName',
      lastName: 'LastName',
      username: 'UserName',
      id: 'RandomId1'
    });

    return super.getProfile().finally(() => axiosMock.restore());
  }
}
