import BasePageObj from '@unit/base.po';

export default class MyButttonPageObj extends BasePageObj {
  click () {
    return this.wrapper.trigger('click');
  }

  isPrimary () {
    return this.wrapper.classes().includes('c-button--primary');
  }
}
