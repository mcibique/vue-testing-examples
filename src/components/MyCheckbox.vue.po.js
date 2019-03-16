import BasePageObj from '@unit/base.po';

export default class MyCheckboxPageObj extends BasePageObj {
  get icon () {
    return this.wrapper.tid('c-checkbox__icon');
  }

  get label () {
    return this.wrapper.tid('c-checkbox__label');
  }

  text () {
    return this.label.text();
  }

  check () {
    return this.icon.trigger('click');
  }

  get isChecked () {
    return this.icon.classes().includes('c-checkbox__icon--checked');
  }

  get isFocused () {
    return this.icon.classes().includes('c-checkbox__icon--focused');
  }

  setChecked (newValue) {
    if (this.isChecked !== newValue) {
      this.check();
    }
  }
}
