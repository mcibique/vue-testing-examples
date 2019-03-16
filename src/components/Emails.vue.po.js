import BasePageObj from '@unit/base.po';
import MyCheckboxPageObj from './MyCheckbox.vue.po';

export default class EmailsPageObj extends BasePageObj {
  get header () {
    return this.tid('c-emails__header');
  }

  get list () {
    return this.tid('c-emails__list');
  }

  get emails () {
    return this.list.tids('c-email').wrappers.map(emailElement => new EmailPageObj(emailElement));
  }

  getEmailByIndex (index) {
    return this.emails[index];
  }
}

export class EmailPageObj extends BasePageObj {
  get subject () {
    return this.tid('c-email__subject');
  }

  get sender () {
    return this.tid('c-email__sender');
  }

  get body () {
    return this.tid('c-email__body');
  }

  get checkbox () {
    return new MyCheckboxPageObj(this.tid('c-emails-list-item__checkbox'));
  }

  isOpen () {
    return this.body.isVisible();
  }

  isUnread () {
    return this.classes().includes('c-email__subject--unread');
  }

  open () {
    if (!this.isOpen()) {
      this.toggle();
    }
  }

  toggle () {
    this.subject.trigger('click');
  }

  select () {
    this.checkbox.setChecked(true);
  }

  deselect () {
    this.checkbox.setChecked(false);
  }
}
