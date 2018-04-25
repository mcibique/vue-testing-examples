import '@unit/globals';
import { compileToFunctions } from 'vue-template-compiler';
import { mount, createLocalVue } from '@vue/test-utils';
import { expect } from 'chai';

import MyCheckbox from '@/components/MyCheckbox.vue';
import MyCheckboxPageObj from '@/components/MyCheckbox.vue.po';

describe('MyCheckbox component', function () {
  beforeEach(function () {
    this.localVue = createLocalVue();

    this.mountMyCheckbox = function (options) {
      let wrapper = mount(MyCheckbox, { localVue: this.localVue, ...options });
      return new MyCheckboxPageObj(wrapper);
    };
  });

  it('should render properly', function () {
    let myCheckbox = this.mountMyCheckbox();
    expect(myCheckbox.exists()).to.be.true;
  });

  it('should render given slot', function () {
    let contentText = 'Random text';
    let slots = { default: `<strong tid="slot-content">${contentText}</strong>` };
    let myCheckbox = this.mountMyCheckbox({ slots });

    expect(myCheckbox.text(), 'Text from slot was not rendered').to.equal(contentText);
    expect(myCheckbox.wrapper.tid('slot-content').exists(), 'The DOM structure was not preserved in the given slot').to.be.true;
  });

  describe('initial state', function () {
    beforeEach(function () {
      this.myCheckbox = this.mountMyCheckbox({ attachToDocument: true });
    });

    it('should be unchecked', function () {
      expect(this.myCheckbox.isChecked(), 'Checkbox was checked after render').to.be.false;
      expect(this.myCheckbox.icon.attributes()['aria-checked'], 'Checkbox had aria-checked').to.be.undefined;
    });

    it('should not be focused', function () {
      expect(this.myCheckbox.isFocused(), 'Checkbox was focused after render').to.be.false;
    });
  });

  describe('after checkbox is clicked', function () {
    beforeEach(function () {
      let Wrapper = this.localVue.extend({
        components: { MyCheckbox },
        data () {
          return { value: false };
        },
        ...compileToFunctions(`<my-checkbox v-model="value"></my-checkbox>`)
      });
      this.myCheckbox = new MyCheckboxPageObj(mount(Wrapper, { localVue: this.localVue }));

      this.myCheckbox.check();
    });

    it('should be checked', function () {
      expect(this.myCheckbox.isChecked(), 'Checkbox was not checked after click').to.be.true;
      expect(this.myCheckbox.icon.attributes()['aria-checked'], `Checkbox didn't set aria-checked`).to.equal('true');
    });

    it('should be focused', function () {
      expect(this.myCheckbox.isFocused(), 'Checkbox was not focused after click').to.be.true;
    });

    describe('and then is clicked again', function () {
      beforeEach(function () {
        this.myCheckbox.check();
      });

      it('should return back to unchecked', function () {
        expect(this.myCheckbox.isChecked(), 'Checkbox was checked after second click').to.be.false;
        expect(this.myCheckbox.icon.attributes()['aria-checked'], `Checkbox didn't remove aria-checked`).to.be.undefined;
      });

      it('should still be focused', function () {
        expect(this.myCheckbox.isFocused(), 'Checkbox was lost focus after second click').to.be.true;
      });
    });
  });
});
