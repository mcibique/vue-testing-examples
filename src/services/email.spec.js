import { expect } from 'chai';
import axios from 'axios';
import AxiosMockAdapter from 'axios-mock-adapter';

import container from '@di';
import { EMAIL_SERVICE_ID } from './email';

describe('Email service', function () {
  beforeEach(function () {
    this.emailService = container.get(EMAIL_SERVICE_ID);
    this.axios = new AxiosMockAdapter(axios);
  });

  afterEach(function () {
    this.axios.verifyNoOutstandingExpectation();
    this.axios.restore();
  });

  it('should exists', function () {
    expect(this.emailService).to.be.ok;
  });

  describe('getEmails()', function () {
    it('should call external API', function () {
      let fakeData = [{ id: 1, subject: 'Random subject' }];
      this.axios.onGet('/api/emails').replyOnce(200, fakeData);
      return this.emailService.getEmails().then(function (response) {
        expect(response).to.deep.equal(fakeData);
      });
    });
  });
});
