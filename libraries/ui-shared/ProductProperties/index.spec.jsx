import React from 'react';
import { mount } from 'enzyme';
import Ellipsis from '@shopgate/pwa-common/components/Ellipsis';
import ProductProperties from './index';

const properties = [{
  label: 'Label One',
  value: 'Value One',
}, {
  label: 'Label Two',
  value: 'Value Two',
}];

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
    expect.assertions(5);

    const wrapper = mount(<ProductProperties properties={properties} />);
    expect(wrapper).toMatchSnapshot();
    expect(wrapper.find(Ellipsis).exists()).toBe(false);

    const listElements = wrapper.find('li');
    expect(listElements.length).toBe(2);

    listElements.forEach((el, index) => {
      expect(listElements.at(index).text()).toBe(`${properties[index].label}: ${properties[index].value}`);
    });
  });

  it('should use the ellipsis component when the lineClamp prop is passed ', () => {
    expect.assertions(6);

    const lineClamp = 2;
    const wrapper = mount(<ProductProperties properties={properties} lineClamp={lineClamp} />);
    expect(wrapper).toMatchSnapshot();

    const listElements = wrapper.find(Ellipsis);
    expect(listElements.length).toBe(2);

    listElements.forEach((el, index) => {
      expect(el.prop('rows')).toBe(lineClamp);
      expect(listElements.at(index).text()).toBe(`${properties[index].label}: ${properties[index].value}`);
    });
  });
});
