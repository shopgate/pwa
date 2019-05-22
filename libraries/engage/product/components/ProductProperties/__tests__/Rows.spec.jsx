import React from 'react';
import { shallow } from 'enzyme';
import Rows from '../Rows';

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

describe('<Rows />', () => {
  it('should render three rows of properties', () => {
    const wrapper = shallow(<Rows properties={properties} />);
    expect(wrapper.find('Row').length).toEqual(3);
    expect(wrapper).toMatchSnapshot();
  });
});
