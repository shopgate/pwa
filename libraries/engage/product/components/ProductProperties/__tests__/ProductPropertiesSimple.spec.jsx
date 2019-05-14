import React from 'react';
import { shallow, mount } from 'enzyme';
import { ProductPropertiesSimple } from '../ProductPropertiesSimple';

const properties = [
  {
    label: 'test1',
    value: '123',
  },
  {
    label: 'test2',
    value: '456',
  },
];

describe('<ProductPropertiesSimple />', () => {
  it('should not render if no data is available', () => {
    const wrapper = shallow(<ProductPropertiesSimple properties={null} />);
    expect(wrapper.find('table').length).toEqual(0);
    expect(wrapper).toMatchSnapshot();
  });

  it('should render table with properties', () => {
    const wrapper = mount(<ProductPropertiesSimple properties={properties} />);
    expect(wrapper.find('table').length).toEqual(1);
    expect(wrapper).toMatchSnapshot();
  });
});
