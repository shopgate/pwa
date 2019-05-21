import React from 'react';
import { shallow } from 'enzyme';
import ProductPropertiesRows from '../ProductPropertiesRows';

const properties = [
  {
    label: 'test1',
    value: '123',
  },
  {
    label: 'test2',
    value: '456',
  },
  {
    label: 'test3',
    value: '789',
  },
];

describe('<ProductPropertiesRows />', () => {
  it('should render three rows of properties', () => {
    const wrapper = shallow(<ProductPropertiesRows properties={properties} />);
    expect(wrapper.find('ProductPropertiesRow').length).toEqual(3);
    expect(wrapper).toMatchSnapshot();
  });
});
