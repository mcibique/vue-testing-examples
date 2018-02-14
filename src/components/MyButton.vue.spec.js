import { mount, createLocalVue } from '@vue/test-utils';
import { expect } from 'chai';

import MyButton from '@/components/MyButton.vue';

describe.only('MyButton component', function () {
  beforeEach(function () {
    this.localVue = createLocalVue();

    this.mountMyButton = function (options) {
      return mount(MyButton, { localVue: this.localVue, ...options });
    };
  });

  it('should render properly', function () {
    let myButton = this.mountMyButton();
    expect(myButton.exists()).to.be.true;
  });

  it('should preserve all html attributes', function () {
    let ButtonWrapper = {
      render (h) {
        return h(MyButton, {
          props: { disabled: 'disabled', id: 'random-id', type: 'submit', 'aria-label': 'random-label', tid: 'random-tid' }
        });
      }
    };

    let myButton = mount(ButtonWrapper, { localVue: this.localVue });
    let attributes = myButton.attributes();
    expect(attributes.disabled).to.equal('disabled');
    expect(attributes.id).to.equal('random-id');
    expect(attributes.tid).to.equal('random-tid');
    expect(attributes.type).to.equal('submit');
    expect(attributes.arialabel).to.equal('random-label');
  });

  it('should call on click handler');
  it('should display slot');
});
