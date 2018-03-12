import BasePageObj from '@unit/base.po';

export default class MyButtonPageObj extends BasePageObj {
  click () {
    return this.wrapper.trigger('click');
  }

  isPrimary () {
    return this.wrapper.classes().includes('c-button--primary');
  }
}
