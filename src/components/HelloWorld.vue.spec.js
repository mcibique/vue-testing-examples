import { expect } from 'chai';
import { shallow } from '@vue/test-utils';
import HelloWorld from '@/components/HelloWorld.vue';

describe('HelloWorld', () => {
  it('renders props.msg when passed', () => {
    let msg = 'new message';
    let wrapper = shallow(HelloWorld, {
      propsData: { msg }
    });
    expect(wrapper.text()).to.include(msg);
  });
});
