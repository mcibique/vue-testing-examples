import BasePageObj from '@unit/base.po';
import EmailsPageObj from '@/components/Emails.vue.po';

export default class WelcomeViewPageObj extends BasePageObj {
  get header () {
    return this.tid('welcome__header');
  }

  get loading () {
    return this.tid('welcome__loading');
  }

  get loadingError () {
    return this.tid('welcome_loading-error');
  }

  get emails () {
    return new EmailsPageObj(this.tid('welcome__emails'));
  }
}
