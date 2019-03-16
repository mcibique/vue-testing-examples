import BasePageObj from '@unit/base.po';

export default class MyCheckboxListStatusPageObj extends BasePageObj {
  get defaultMessage () {
    return this.tid('c-checkbox-list-status__default-message');
  }
}
