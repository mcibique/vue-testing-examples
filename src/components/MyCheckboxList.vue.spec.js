import '@unit/globals';
import Vue from 'vue';
import { mount, createLocalVue } from '@vue/test-utils';
import { compileToFunctions } from 'vue-template-compiler';
import { expect } from 'chai';

import MyCheckbox from '@/components/MyCheckbox.vue';
import MyCheckboxList from '@/components/MyCheckboxList.vue';
import MyCheckboxListPageObj from '@/components/MyCheckboxList.vue.po';
import MyCheckboxListStatus from '@/components/MyCheckboxListStatus.vue';

describe('MyCheckboxList component', function () {
  beforeEach(function () {
    this.localVue = createLocalVue();

    this.mountMyCheckboxList = function (template, options) {
      let Wrapper = Vue.extend({
        ...compileToFunctions(template),
        components: { MyCheckboxList, MyCheckbox, MyCheckboxListStatus }
      });

      let wrapper = mount(Wrapper, { localVue: this.localVue, ...options });
      return new MyCheckboxListPageObj(wrapper);
    };
  });

  it('should render properly', function () {
    let myCheckboxList = this.mountMyCheckboxList(`<my-checkbox-list></my-checkbox-list>`);
    expect(myCheckboxList.exists()).to.be.true;
  });

  describe('when there are no checkboxes in the list', function () {
    describe('and only the checkbox list status is in the list with default template', function () {
      beforeEach(function () {
        this.myCheckboxList = this.mountMyCheckboxList(
          `<my-checkbox-list>
            <my-checkbox-list-status></my-checkbox-list-status>
          </my-checkbox-list>`
        );
      });

      it('should render nothing', function () {
        expect(this.myCheckboxList.status.exists()).to.be.false;
        expect(this.myCheckboxList.checkboxes.length).to.equal(0);
      });
    });

    describe("and the checkbox list status has it's own template", function () {
      beforeEach(function () {
        this.myCheckboxList = this.mountMyCheckboxList(
          `<my-checkbox-list>
            <my-checkbox-list-status>
              <template slot-scope="{ numberOfCheckboxes, numberOfSelectedCheckboxes }">
                Random Text
              </template>
            </my-checkbox-list-status>
          </my-checkbox-list>`
        );
      });

      it('should render nothing', function () {
        expect(this.myCheckboxList.status.exists()).to.be.false;
        expect(this.myCheckboxList.checkboxes.length).to.equal(0);
      });
    });
  });

  describe('when there are checkboxes in the list', function () {
    describe('and the checkbox list status uses default template', function () {
      beforeEach(function () {
        this.myCheckboxList = this.mountMyCheckboxList(
          `<my-checkbox-list>
            <div>
              <my-checkbox-list-status></my-checkbox-list-status>
              <my-checkbox v-model="checkbox1">Checkbox 1</my-checkbox>
            </div>
          </my-checkbox-list>`,
          {
            data () {
              return {
                checkbox1: false
              };
            }
          }
        );
      });

      it('should render the checkbox list status', function () {
        expect(this.myCheckboxList.status.exists()).to.be.true;
        expect(this.myCheckboxList.status.text()).to.equal('You selected 0 item(s).');
      });

      it('should render checkboxes', function () {
        expect(this.myCheckboxList.checkboxes.length).to.equal(1);
      });

      describe('and the user changes the checkbox value', function () {
        beforeEach(async function () {
          let checkbox = this.myCheckboxList.checkboxes[0];
          expect(checkbox.isChecked).to.be.false;
          checkbox.check();
          await Vue.nextTick();
          expect(checkbox.isChecked).to.be.true;
        });

        it('should update the message in the checkbox list status', function () {
          expect(this.myCheckboxList.status.text()).to.equal('You selected 1 item(s).');
        });
      });
    });

    describe('and the checkbox list status uses custom template', function () {
      beforeEach(function () {
        this.myCheckboxList = this.mountMyCheckboxList(
          `<my-checkbox-list>
            <div>
              <my-checkbox-list-status>
                <template slot-scope="{ numberOfCheckboxes, numberOfSelectedCheckboxes }">
                  Random Text {{ numberOfCheckboxes }}, {{ numberOfSelectedCheckboxes }}.
                </template>
              </my-checkbox-list-status>
              <my-checkbox v-model="checkbox1">Checkbox 1</my-checkbox>
            </div>
          </my-checkbox-list>`,
          {
            data () {
              return {
                checkbox1: false
              };
            }
          }
        );
      });

      it('should render the checkbox list status with custom template', function () {
        expect(this.myCheckboxList.status.exists()).to.be.true;
        expect(this.myCheckboxList.status.text()).to.equal('Random Text 1, 0.');
      });
    });

    describe('and one of the checkboxes is pre-selected', function () {
      beforeEach(function () {
        this.myCheckboxList = this.mountMyCheckboxList(
          `<my-checkbox-list>
            <div>
              <my-checkbox-list-status></my-checkbox-list-status>
              <my-checkbox v-model="checkbox1">Checkbox 1</my-checkbox>
              <my-checkbox v-model="checkbox2">Checkbox 2</my-checkbox>
              <my-checkbox v-model="checkbox3">Checkbox 3</my-checkbox>
            </div>
          </my-checkbox-list>`,
          {
            data () {
              return {
                checkbox1: false,
                checkbox2: true,
                checkbox3: false
              };
            }
          }
        );
      });

      it('should render the checkbox list status with correct counter', function () {
        expect(this.myCheckboxList.status.exists()).to.be.true;
        expect(this.myCheckboxList.status.text()).to.equal('You selected 1 item(s).');
      });

      describe('and the user checks another checkbox in the list', function () {
        beforeEach(async function () {
          let checkbox = this.myCheckboxList.checkboxes[0];
          expect(checkbox.isChecked).to.be.false;
          checkbox.check();
          await Vue.nextTick();
          expect(checkbox.isChecked).to.be.true;
        });

        it('should update the message in the checkbox list status', function () {
          expect(this.myCheckboxList.status.text()).to.equal('You selected 2 item(s).');
        });
      });
    });
  });
});
