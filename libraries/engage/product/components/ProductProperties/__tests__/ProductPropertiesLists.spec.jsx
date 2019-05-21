import React from 'react';
import { shallow } from 'enzyme';
import ProductPropertiesLists from '../ProductPropertiesLists';

const propertiesNoSubs = [
  {
    name: 'test1',
    label: 'Test 1',
  },
  {
    name: 'test2',
    label: 'Test 2',
  },
];

const propertiesSubs = [
  {
    name: 'test1',
    label: 'Test 1',
    subDisplayGroup: 'Test 1',
  },
  {
    name: 'test2',
    label: 'Test 2',
    subDisplayGroup: 'Test 2',
  },
];

describe('<ProductPropertiesLists />', () => {
  it('should only render simple rows', () => {
    const wrapper = shallow(<ProductPropertiesLists key="1" properties={propertiesNoSubs} />);
    expect(wrapper.find('ProductPropertiesRows').length).toEqual(1);
    expect(wrapper.find('ProductPropertiesGroup').length).toEqual(0);
    expect(wrapper).toMatchSnapshot();
  });

  it('should render groups only', () => {
    const wrapper = shallow(<ProductPropertiesLists key="2" properties={propertiesSubs} />);
    expect(wrapper.find('ProductPropertiesRows').length).toEqual(3);
    expect(wrapper.find('ProductPropertiesRows').at(0).prop('properties')).toEqual([]);
    expect(wrapper.find('ProductPropertiesRows').at(1).prop('properties')).toEqual([
      {
        name: 'test1',
        label: 'Test 1',
        subDisplayGroup: 'Test 1',
      },
    ]);
    expect(wrapper.find('ProductPropertiesRows').at(2).prop('properties')).toEqual([
      {
        name: 'test2',
        label: 'Test 2',
        subDisplayGroup: 'Test 2',
      },
    ]);
    expect(wrapper.find('ProductPropertiesGroup').length).toEqual(2);
    expect(wrapper.find('ProductPropertiesGroup').at(0).prop('group')).toEqual('Test 1');
    expect(wrapper.find('ProductPropertiesGroup').at(1).prop('group')).toEqual('Test 2');
  });
});
