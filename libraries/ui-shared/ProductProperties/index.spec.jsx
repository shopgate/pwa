import React from 'react';
import { mount } from 'enzyme';
import ProductProperties from './index';

describe('<ProductProperties />', () => {
  it('should not render when no properties are passed', () => {
    const wrapper = mount(<ProductProperties />);
    expect(wrapper).toMatchSnapshot();
    expect(wrapper).toBeEmptyRender();
  });

  it('should not render when an empty list of properties is passed', () => {
    const wrapper = mount(<ProductProperties properties={[]} />);
    expect(wrapper).toMatchSnapshot();
    expect(wrapper).toBeEmptyRender();
  });

  it('should render as expected when properties are passed', () => {
    const properties = [{
      label: 'Label One',
      value: 'Value One',
    }, {
      label: 'Label Two',
      value: 'Value Two',
    }];

    const wrapper = mount(<ProductProperties properties={properties} />);
    expect(wrapper).toMatchSnapshot();
    const list = wrapper.find('li');
    expect(list.length).toBe(2);
    expect(list.at(0).text()).toBe(`${properties[0].label}: ${properties[0].value}`);
    expect(list.at(1).text()).toBe(`${properties[1].label}: ${properties[1].value}`);
  });
});
