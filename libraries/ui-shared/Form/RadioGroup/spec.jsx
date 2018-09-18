import React from 'react';
import { mount } from 'enzyme';
import RadioItem from './components/Item';
import RadioGroup from '.';

const defProps = {
  name: 'radio',
};

describe('<RadioGroup />', () => {
  it('should render empty group', () => {
    const wrapper = mount(<RadioGroup {...defProps} />);
    expect(wrapper).toMatchSnapshot();
  });

  it('should render column group with items', () => {
    const wrapper = mount((
      <RadioGroup {...defProps}>
        <RadioItem name="foo" label="foo" />
      </RadioGroup>
    ));

    expect(wrapper).toMatchSnapshot();
    expect(wrapper.find(RadioItem).length).toEqual(1);
    expect(typeof wrapper.find(RadioItem).prop('onChange')).toEqual('function');
  });

  it('should render rows group with items', () => {
    const wrapper = mount((
      <RadioGroup {...defProps} direction="rows">
        <RadioItem name="foo" label="foo" />
      </RadioGroup>
    ));
    expect(wrapper).toMatchSnapshot();
  });

  it('should use default value', () => {
    const wrapper = mount((
      <RadioGroup {...defProps} value="foo">
        <RadioItem name="foo" label="foo" />
      </RadioGroup>
    ));

    expect(wrapper).toMatchSnapshot();
    expect(wrapper.find(RadioItem).length).toEqual(1);
    expect(wrapper.find(RadioItem).prop('checked')).toEqual(true);
  });

  it('should have on value at a time', () => {
    const wrapper = mount((
      <RadioGroup {...defProps}>
        <RadioItem name="foo" label="foo" />
        <RadioItem name="bar" label="bar" />
      </RadioGroup>
    ));

    expect(wrapper).toMatchSnapshot();
    expect(wrapper.find(RadioItem).length).toEqual(2);

    const radio1 = wrapper.find(RadioItem).at(0).find('input');
    const radio2 = wrapper.find(RadioItem).at(1).find('input');

    // First element value
    radio1.simulate('change');
    wrapper.update();
    expect(wrapper.find(RadioItem).at(0).prop('checked')).toEqual(true);
    expect(wrapper.find(RadioItem).at(1).prop('checked')).toEqual(false);

    // Second element value
    radio2.simulate('change');
    wrapper.update();
    expect(wrapper.find(RadioItem).at(0).prop('checked')).toEqual(false);
    expect(wrapper.find(RadioItem).at(1).prop('checked')).toEqual(true);
  });

  it('should call onChange callback', () => {
    const onChange = jest.fn();
    const wrapper = mount((
      <RadioGroup {...defProps} onChange={onChange}>
        <RadioItem name="foo" label="foo" />
      </RadioGroup>
    ));

    expect(wrapper).toMatchSnapshot();
    expect(wrapper.find(RadioItem).length).toEqual(1);

    const radio = wrapper.find(RadioItem).at(0).find('input');
    radio.simulate('change');

    expect(onChange).toHaveBeenCalledWith('foo');
  });
});
