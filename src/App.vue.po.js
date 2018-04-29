import BasePageObj from '@unit/base.po';

export default class AppPageObj extends BasePageObj {
  get header () {
    return this.tid('c-app__header');
  }

  get main () {
    return this.tid('c-app__main');
  }

  get footer () {
    return this.tid('c-app__footer');
  }

  get logoutLink () {
    return this.tid('c-app__logout-link');
  }

  get aboutLink () {
    return this.tid('c-app__about-link');
  }

  logout () {
    this.logoutLink.trigger('click');
  }
}
