import React from 'react';
import { mount } from 'enzyme';
import CheckedIcon from '../icons/RadioCheckedIcon';
import UncheckedIcon from '../icons/RadioUncheckedIcon';
import RadioButton from './index';

describe('RadioButton', () => {
  it('should render selected RadioButton', () => {
    const wrapper = mount(<RadioButton checked />);
    expect(wrapper.find(CheckedIcon).exists()).toBe(true);
    expect(wrapper.find(UncheckedIcon).exists()).toBe(false);
    expect(wrapper).toMatchSnapshot();
  });

  it('should render unselected RadioButton', () => {
    const wrapper = mount(<RadioButton />);
    expect(wrapper.find(CheckedIcon).exists()).toBe(false);
    expect(wrapper.find(UncheckedIcon).exists()).toBe(true);
    expect(wrapper).toMatchSnapshot();
  });
});
