import '@unit/globals';
import { mount, createLocalVue } from '@vue/test-utils';
import { compileToFunctions } from 'vue-template-compiler';
import { expect } from 'chai';

import Focus from './focus';

describe('Focus directive', function () {
  beforeEach(function () {
    this.localVue = createLocalVue();

    this.mountTemplate = function (template, wrapperOptions, options) {
      let Wrapper = this.localVue.extend({
        ...compileToFunctions(template),
        directives: {
          Focus
        },
        ...wrapperOptions
      });

      return mount(Wrapper, { localVue: this.localVue, attachToDocument: true, ...options });
    };

    // whatever is focused now, reset it
    document.activeElement.blur();
    expect(document.activeElement).to.equal(document.body);
    // clean up elements attached to the document by previous tests
    document.body.innerHTML = '';
  });

  describe('when directive doesn\'t have value specified', function () {
    beforeEach(function () {
      this.wrapper = this.mountTemplate(`
        <form>
          <input type="text" id="input1" ref="input1">
          <input type="text" id="input2" ref="input2" v-focus>
          <input type="text" id="input3" ref="input3">
        </form>`);
    });

    it('should focus the element after it is mounted', function () {
      expect(document.activeElement).to.equal(this.wrapper.vm.$refs.input2);
    });
  });

  describe('when directive does have value specified', function () {
    describe('and the initial value is truthy', function () {
      beforeEach(function () {
        this.wrapper = this.mountTemplate(`
          <form>
            <input type="text" id="input1" ref="input1">
            <input type="text" id="input2" ref="input2" v-focus="true">
            <input type="text" id="input3" ref="input3">
          </form>`);
      });

      it('should focus the element after it is mounted', function () {
        expect(document.activeElement).to.equal(this.wrapper.vm.$refs.input2);
      });
    });

    describe('and the initial value is falsy', function () {
      beforeEach(function () {
        this.wrapper = this.mountTemplate(`
          <form>
            <input type="text" id="input1" ref="input1">
            <input type="text" id="input2" ref="input2" v-focus="focusValue">
            <input type="text" id="input3" ref="input3">
          </form>`, {
          data () {
            return { focusValue: false };
          }
        });
      });

      it('should not focus the element after it is mounted', function () {
        expect(document.activeElement).to.equal(document.body);
      });

      describe('and the value has changed to truthy value', function () {
        beforeEach(function () {
          this.wrapper.setData({ focusValue: true });
        });

        it('should focus the element with directive', function () {
          expect(document.activeElement).to.equal(this.wrapper.vm.$refs.input2);
        });

        describe('and value has changed back to falsy value', function () {
          beforeEach(function () {
            this.wrapper.setData({ focusValue: false });
          });

          it('should remove focus from the element with directive', function () {
            expect(document.activeElement).to.equal(document.body);
          });
        });
      });
    });
  });

  describe('when the directive is specified on element which is not focusable (div, form, section, header) but has tabindex specified', function () {
    beforeEach(function () {
      this.wrapper = this.mountTemplate(`
        <form id="form" ref="form" tabindex="0" v-focus>
          <input type="text" id="input1" ref="input1">
          <input type="text" id="input2" ref="input2">
          <input type="text" id="input3" ref="input3">
        </form>`);
    });

    it('should focus element with tabindex after it is mounted', function () {
      expect(document.activeElement).to.equal(this.wrapper.vm.$refs.form);
    });
  });

  describe('when there are multiple instances of the directive specified', function () {
    beforeEach(function () {
      this.wrapper = this.mountTemplate(`
        <form>
          <input type="text" id="input1" ref="input1" v-focus>
          <input type="text" id="input2" ref="input2" v-focus>
          <input type="text" id="input3" ref="input3">
        </form>`);
    });

    it('should focus the last element after it is mounted', function () {
      expect(document.activeElement).to.equal(this.wrapper.vm.$refs.input2);
    });
  });

  describe('when there are multiple instances of the directive with value specified', function () {
    beforeEach(function () {
      this.wrapper = this.mountTemplate(`
        <form id="form" ref="form" tabindex="0" v-focus="focusValue1">
          <input type="text" id="input1" ref="input1" v-focus="focusValue2">
          <input type="text" id="input2" ref="input2" v-focus="focusValue3">
          <input type="text" id="input3" ref="input3" v-focus="focusValue4">
        </form>`, {
        data () {
          return { focusValue1: false, focusValue2: true, focusValue3: false, focusValue4: false };
        }
      });
    });

    it('should focus the element with truthy value after it is mounted', function () {
      expect(document.activeElement).to.equal(this.wrapper.vm.$refs.input1);
    });

    describe('and values have changed', function () {
      it('should be changing the focus of all elements', function () {
        this.wrapper.setData({ focusValue2: false, focusValue1: true });
        expect(document.activeElement).to.equal(this.wrapper.vm.$refs.form);

        this.wrapper.setData({ focusValue1: false, focusValue4: true });
        expect(document.activeElement).to.equal(this.wrapper.vm.$refs.input3);

        this.wrapper.setData({ focusValue4: false, focusValue3: true });
        expect(document.activeElement).to.equal(this.wrapper.vm.$refs.input2);

        this.wrapper.setData({ focusValue3: false, focusValue2: true });
        expect(document.activeElement).to.equal(this.wrapper.vm.$refs.input1);
      });
    });
  });
});
