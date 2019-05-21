import React from 'react';
import { shallow } from 'enzyme';
import ProductPropertiesGrouped from '../ProductPropertiesGrouped';

const properties = [
  {
    name: 'test1',
    label: 'Test 1',
    displayGroup: 'Group 1',
  },
  {
    name: 'test2',
    label: 'Test 2',
    displayGroup: 'Group 1',
  },
  {
    name: 'test3',
    label: 'Test 3',
    displayGroup: 'Group 2',
  },
  {
    name: 'test4',
    label: 'Test 4',
    displayGroup: 'Group 2',
  },
];

const groups = ['Group 1', 'Group 2'];

describe('<ProductPropertiesGrouped />', () => {
  it('should render as expected', () => {
    const wrapper = shallow(<ProductPropertiesGrouped properties={properties} groups={groups} />);
    expect(wrapper.find('Accordion').length).toEqual(2);
    expect(wrapper.find('ProductPropertiesWrapper').length).toEqual(2);
    expect(wrapper.find('ProductPropertiesWrapper').at(0).prop('dense')).toEqual(true);
    expect(wrapper.find('ProductPropertiesLists').length).toEqual(2);
    expect(wrapper).toMatchSnapshot();
  });
});
