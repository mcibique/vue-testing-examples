import BasePageObj from '@unit/base.po';

export default class AboutViewPageObj extends BasePageObj {
  get heading () {
    return this.tid('c-about__heading');
  }

  get githubLink () {
    return this.tid('c-about__github-link');
  }

  get backLink () {
    return this.tid('c-about__back-link');
  }

  goBack () {
    return this.backLink.trigger('click');
  }
}
