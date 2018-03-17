import BasePageObj from '@unit/base.po';

export default class DashboardPageObj extends BasePageObj {
  get emailsSection () {
    return new EmailsSectionPageObj(this.tid('dashboard__emails'));
  }
}

export class EmailsSectionPageObj extends BasePageObj {
  get header () {
    return this.tid('dashboard__emails-header');
  }

  get list () {
    return this.tid('dashboard__emails-list');
  }

  get emails () {
    return this.list.tids('dashboard__email').wrappers.map(emailElement => new EmailPageObj(emailElement));
  }

  getEmailByIndex (index) {
    return this.emails[index];
  }
}

export class EmailPageObj extends BasePageObj {
  get subject () {
    return this.tid('dashboard__email-subject');
  }

  get sender () {
    return this.tid('dashboard__email-sender');
  }

  isUnread () {
    return this.subject.classes().includes('dashboard__email-subject--unread');
  }
}
