import BasePageObj from '@unit/base.po';

export default class EmailsPageObj extends BasePageObj {
  get header () {
    return this.tid('emails__header');
  }

  get list () {
    return this.tid('emails__list');
  }

  get emails () {
    return this.list.tids('email').wrappers.map(emailElement => new EmailPageObj(emailElement));
  }

  getEmailByIndex (index) {
    return this.emails[index];
  }
}

export class EmailPageObj extends BasePageObj {
  get subject () {
    return this.tid('email__subject');
  }

  get sender () {
    return this.tid('email__sender');
  }

  get body () {
    return this.tid('email__body');
  }

  isOpen () {
    return this.body.isVisible();
  }

  isUnread () {
    return this.classes().includes('email__subject--unread');
  }

  open () {
    if (!this.isOpen()) {
      this.toggle();
    }
  }

  toggle () {
    this.subject.trigger('click');
  }
}
