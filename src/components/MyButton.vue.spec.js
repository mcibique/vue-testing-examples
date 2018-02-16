import { mount, createLocalVue } from '@vue/test-utils';
import { expect } from 'chai';
import sinon from 'sinon';

import MyButton from '@/components/MyButton.vue';
import MyButttonPageObj from '@/components/MyButton.vue.po';

describe('MyButton component', function () {
  beforeEach(function () {
    this.localVue = createLocalVue();

    this.mountMyButton = function (options) {
      let wrapper = mount(MyButton, { localVue: this.localVue, ...options });
      return new MyButttonPageObj(wrapper);
    };
  });

  it('should render properly', function () {
    let myButton = this.mountMyButton();
    expect(myButton.exists()).to.be.true;
  });

  it('should render given slot', function () {
    let contentText = 'Random text';
    let slots = { default: `<strong>${contentText}</strong>` };
    let myButton = this.mountMyButton({ slots });

    expect(myButton.text(), 'Text from slot was not rendered').to.equal(contentText);
    expect(myButton.wrapper.find('strong').exists(), 'The DOM structure was not preserved in the given slot').to.be.true;
  });

  it('should make button primary', function () {
    let myButton = this.mountMyButton({
      context: {
        props: { primary: true }
      }
    });
    expect(myButton.isPrimary(), 'Button was not set as primary').to.be.true;
  });

  it('should preserve all given html attributes (standard, custom, data-*)', function () {
    let myButton = this.mountMyButton({
      context: {
        attrs: { disabled: 'disabled', id: 'random-id', type: 'submit', 'aria-label': 'random-label', tid: 'random-tid', 'data-random-attr': 'random-attr-value' }
      }
    });
    let attributes = myButton.attributes();

    expect(attributes.disabled).to.equal('disabled');
    expect(attributes.id).to.equal('random-id');
    expect(attributes.tid).to.equal('random-tid');
    expect(attributes.type).to.equal('submit');
    expect(attributes['aria-label']).to.equal('random-label');
    expect(attributes['data-random-attr']).to.equal('random-attr-value');
  });

  it('should merge class attribute with its own classes', function () {
    let myButton = this.mountMyButton({
      context: {
        staticClass: 'random-class'
      }
    });

    expect(myButton.wrapper.classes()).to.deep.equal(['random-class', 'c-button']);
  });

  it('should call on click handler', function () {
    let clickHandler = sinon.stub();
    let myButton = this.mountMyButton({
      context: {
        on: {
          click: clickHandler
        }
      }
    });
    myButton.click();
    expect(clickHandler, 'Click handler has not been called').to.have.been.called;
  });
});
