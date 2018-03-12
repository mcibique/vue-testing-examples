import { expect } from 'chai';
import axios from 'axios';
import AxiosMockAdapter from 'axios-mock-adapter';

import container from '@di';
import { PROFILE_SERVICE_ID } from './profile';

describe.only('Profile service', function () {
  beforeEach(function () {
    this.profileService = container.get(PROFILE_SERVICE_ID);
    this.axios = new AxiosMockAdapter(axios);
  });

  afterEach(function () {
    this.axios.verifyNoOutstandingExpectation();
    this.axios.reset();
  });

  it('should exists', function() {
    expect(this.profileService).to.be.ok;
  });

  describe('getProfile()', function() {
    it('should call external API', function() {
      let fakeData = {
        username: 'fake_username',
      };
      this.axios.onGet('/api/profile').replyOnce(200, fakeData);
      return this.profileService.getProfile().then(function(response) {
        expect(response).to.deep.equal(fakeData);
      });
    });
  });
});