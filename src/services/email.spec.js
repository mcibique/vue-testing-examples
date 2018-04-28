import '@unit/globals';
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
      expect(this.emailService.getEmails()).to.become(fakeData);
    });
  });

  describe('markEmailAsRead()', function () {
    it('should call external API', function () {
      let emailId = 123;
      let fakeData = {};
      this.axios.onPut(`/api/emails/${emailId}`).replyOnce(204, fakeData);
      expect(this.emailService.markEmailAsRead(emailId)).to.become(fakeData);
    });

    it('should mark given email as read', function () {
      let emailId = 123;
      let fakeData = {};
      this.axios.onPut(`/api/emails/${emailId}`, { unread: false }).replyOnce(204, fakeData);
      expect(this.emailService.markEmailAsRead(emailId)).to.become(fakeData);
    });
  });
});
