import React from 'react';
import { mount } from 'enzyme';
import RadioItem from './components/Item';
import RadioGroup from '.';

describe('<RadioGroup />', () => {
  it('should render empty group', () => {
    const wrapper = mount(<RadioGroup />);
    expect(wrapper).toMatchSnapshot();
  });

  it('should render group with item', () => {
    const wrapper = mount((
      <RadioGroup>
        <RadioItem name="foo" label="foo" />
      </RadioGroup>
    ));

    expect(wrapper).toMatchSnapshot();
    expect(wrapper.find(RadioItem).length).toEqual(1);
    expect(typeof wrapper.find(RadioItem).prop('onChange')).toEqual('function');
  });

  it('should make default as active', () => {
    const wrapper = mount((
      <RadioGroup default="foo">
        <RadioItem name="foo" label="foo" />
      </RadioGroup>
    ));

    expect(wrapper).toMatchSnapshot();
    expect(wrapper.find(RadioItem).length).toEqual(1);
    expect(wrapper.find(RadioItem).prop('active')).toEqual(true);
  });

  it('should have on active at a time', () => {
    const wrapper = mount((
      <RadioGroup>
        <RadioItem name="foo" label="foo" />
        <RadioItem name="bar" label="bar" />
      </RadioGroup>
    ));

    expect(wrapper).toMatchSnapshot();
    expect(wrapper.find(RadioItem).length).toEqual(2);

    // First element active
    expect(wrapper.find(RadioItem).at(0).prop('onChange')());
    wrapper.update();
    expect(wrapper.find(RadioItem).at(0).prop('active')).toEqual(true);
    expect(wrapper.find(RadioItem).at(1).prop('active')).toEqual(false);

    // Second element active
    expect(wrapper.find(RadioItem).at(1).prop('onChange')());
    wrapper.update();
    expect(wrapper.find(RadioItem).at(0).prop('active')).toEqual(false);
    expect(wrapper.find(RadioItem).at(1).prop('active')).toEqual(true);
  });

  it('should call onChange callback', () => {
    const onChange = jest.fn();
    const wrapper = mount((
      <RadioGroup onChange={onChange}>
        <RadioItem name="foo" label="foo" />
      </RadioGroup>
    ));

    expect(wrapper).toMatchSnapshot();
    expect(wrapper.find(RadioItem).length).toEqual(1);
    wrapper.find(RadioItem).prop('onChange')();

    expect(onChange).toHaveBeenCalledWith('foo');
  });
});
