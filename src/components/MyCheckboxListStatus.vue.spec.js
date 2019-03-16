import '@unit/globals';
import { mount, createLocalVue } from '@vue/test-utils';
import { expect } from 'chai';
import sinon from 'sinon';

import MyCheckboxListStatus from '@/components/MyCheckboxListStatus.vue';
import MyCheckboxListStatusPageObj from '@/components/MyCheckboxListStatus.vue.po';
import MY_CHECKBOX_LIST_CONTEXT from '@/components/MyCheckboxListContext';

describe('MyCheckboxListStatus component', function () {
  beforeEach(function () {
    this.localVue = createLocalVue();

    this.checkboxListMock = {};

    this.mountMyCheckboxListStatus = function (options) {
      let provide = { [MY_CHECKBOX_LIST_CONTEXT]: this.checkboxListMock };
      let wrapper = mount(MyCheckboxListStatus, { localVue: this.localVue, provide, ...options });
      return new MyCheckboxListStatusPageObj(wrapper);
    };
  });

  describe("when it's not inside checkbox list", function () {
    it('should throw an error', function () {
      this.originalError = console.error;
      console.error = sinon.stub();

      expect(() => {
        this.mountMyCheckboxListStatus({ provide: {} });
      }).to.throw(TypeError);

      expect(console.error).to.have.been.called;
      expect(console.error.firstCall.args[0]).to.contain('Injection "checkboxList" not found');
      console.error = this.originalError;
    });
  });

  describe('when no slot is provided', function () {
    beforeEach(function () {
      this.checkboxListMock = { numberOfSelectedCheckboxes: 8, numberOfCheckboxes: 15 };
      this.checkboxListStatus = this.mountMyCheckboxListStatus({ scopedSlots: {} });
    });

    it('should use default slot', function () {
      expect(this.checkboxListStatus.defaultMessage.text()).to.equal(`You selected ${this.checkboxListMock.numberOfSelectedCheckboxes} item(s).`);
    });
  });

  describe('when custom slot is provided', function () {
    beforeEach(function () {
      this.checkboxListMock = { numberOfSelectedCheckboxes: 8, numberOfCheckboxes: 15 };
      this.checkboxListStatus = this.mountMyCheckboxListStatus({
        scopedSlots: {
          default: `
            <p slot-scope="{ numberOfSelectedCheckboxes, numberOfCheckboxes }">
              Random Text, {{ numberOfSelectedCheckboxes }}, {{ numberOfCheckboxes }}.
            </p>`
        }
      });
    });

    it('should use custom slot', function () {
      expect(this.checkboxListStatus.text()).to.equal(`Random Text, 8, 15.`);
    });
  });

  describe('when there are no checkboxes in the list', function () {
    beforeEach(function () {
      this.checkboxListMock = { numberOfSelectedCheckboxes: 0, numberOfCheckboxes: 0 };
      this.checkboxListStatus = this.mountMyCheckboxListStatus();
    });

    it('should NOT render anything', function () {
      expect(this.checkboxListStatus.text()).to.equal('');
    });
  });
});
