import axios from 'axios';
import AxiosMockAdapter from 'axios-mock-adapter';
import { Override } from '@di';

import EmailService, { EMAIL_SERVICE_ID } from './email.js'; // always use '.js' extension otherwise this module will required.

export { EMAIL_SERVICE_ID };

@Override(EMAIL_SERVICE_ID)
export default class EmailStubService extends EmailService {
  getEmails () {
    let axiosMock = new AxiosMockAdapter(axios);
    axiosMock.onGet('/api/emails').replyOnce(200, [{
      id: 1,
      subject: 'Lorem ipsum dolor sit amet, consectetur',
      body: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
      sender: 'random.address@domain.com',
      unread: true
    }, {
      id: 2,
      subject: 'Lorem ipsum dolor sit amet, consectetur',
      body: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
      sender: 'random.address@domain.com',
      unread: true
    }, {
      id: 3,
      subject: 'Lorem ipsum dolor sit amet, consectetur',
      body: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
      sender: 'random.address@domain.com',
      unread: false
    }, {
      id: 4,
      subject: 'Lorem ipsum dolor sit amet, consectetur',
      body: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
      sender: 'random.address@domain.com',
      unread: false
    }]);

    return super.getEmails().finally(() => axiosMock.restore());
  }
}
