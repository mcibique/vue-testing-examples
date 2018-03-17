import { mount, createLocalVue } from '@vue/test-utils';
import { expect } from 'chai';
import sinon from 'sinon';
import flushPromises from 'flush-promises';

import container from '@di';
import { createStore, STORE_ID } from '@/store';
import { createRouter, ROUTER_ID } from '@/router';
import AboutView from '@/views/About.vue';
import AboutViewPageObj from '@/views/About.vue.po';

describe('About view', function () {
  beforeEach(function () {
    container.snapshot();

    this.localVue = createLocalVue();
    this.store = createStore(this.localVue);
    container.bind(STORE_ID).toConstantValue(this.store);

    this.router = createRouter(this.localVue);
    container.bind(ROUTER_ID).toConstantValue(this.router);

    this.router.push({ name: 'about' });

    this.mountAboutView = function (options) {
      let wrapper = mount(AboutView, { localVue: this.localVue, router: this.router, store: this.store, ...options });
      return new AboutViewPageObj(wrapper);
    };

    return flushPromises();
  });

  afterEach(function () {
    container.restore();
  });

  it('should enter route', function () {
    expect(this.router.currentRoute.name).to.equal('about');
  });

  it('should mount without any errors', function () {
    this.mountAboutView();
    expect(console.error).not.to.have.been.called;
  });

  it('should render properly', function () {
    let aboutView = this.mountAboutView();
    expect(aboutView.heading.exists(), 'Should display default heading').to.be.true;
    expect(aboutView.githubLink.exists(), 'Should display github link').to.be.true;
    expect(aboutView.githubLink.attributes().target, 'Should open external link in a new tab').to.equal('_blank');
    expect(aboutView.githubLink.attributes().rel, 'External link should always prevent access to referrer and opener').to.equal('noreferrer noopener');
    expect(aboutView.backLink.exists(), 'Should have option to navigate back to previous view').to.be.true;
  });

  describe('when user navigates back', function () {
    beforeEach(function () {
      sinon.spy(this.router, 'push');

      this.aboutView = this.mountAboutView();
      this.aboutView.goBack();
      return flushPromises();
    });

    it('should navigate back to the root view', function () {
      expect(this.router.push).to.have.been.calledWithMatch({ name: 'root' });
    });
  });
});
