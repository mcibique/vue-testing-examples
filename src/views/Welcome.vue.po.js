import BasePageObj from '@unit/base.po';
import DashboardPageObj from '@/components/Dashboard.vue.po';

export default class WelcomeViewPageObj extends BasePageObj {
  get header() {
    return this.tid('welcome__header');
  }

  get loading() {
    return this.tid('welcome__loading');
  }

  get loadingError() {
    return this.tid('welcome_loading-error');
  }

  get dashboard() {
    return new DashboardPageObj(this.tid('welcome__dashboard'));
  }
}
