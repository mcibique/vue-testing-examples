import BasePageObj from '@unit/base.po';
import MyCheckboxListStatusPageObj from './MyCheckboxListStatus.vue.po';
import MyCheckboxPageObj from './MyCheckbox.vue.po';

export default class MyCheckboxListPageObj extends BasePageObj {
  get statusElement () {
    return this.tid('c-checkbox-list-status');
  }

  get status () {
    return new MyCheckboxListStatusPageObj(this.statusElement);
  }

  get checkboxElements () {
    return this.tids('c-checkbox');
  }

  get checkboxes () {
    return this.checkboxElements.wrappers.map(checkboxElement => new MyCheckboxPageObj(checkboxElement));
  }
}
