import React from 'react';
import { shallow } from 'enzyme';
import Lists from '../Lists';

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

describe('<Lists />', () => {
  it('should only render simple rows', () => {
    const wrapper = shallow(<Lists key="1" properties={propertiesNoSubs} />);
    expect(wrapper.find('Rows').length).toEqual(1);
    expect(wrapper.find('Group').length).toEqual(0);
    expect(wrapper).toMatchSnapshot();
  });

  it('should render groups only', () => {
    const wrapper = shallow(<Lists key="2" properties={propertiesSubs} />);
    expect(wrapper.find('Rows').length).toEqual(3);
    expect(wrapper.find('Rows').at(0).prop('properties')).toEqual([]);
    expect(wrapper.find('Rows').at(1).prop('properties')).toEqual([
      {
        name: 'test1',
        label: 'Test 1',
        subDisplayGroup: 'Test 1',
      },
    ]);
    expect(wrapper.find('Rows').at(2).prop('properties')).toEqual([
      {
        name: 'test2',
        label: 'Test 2',
        subDisplayGroup: 'Test 2',
      },
    ]);
    expect(wrapper.find('Group').length).toEqual(2);
    expect(wrapper.find('Group').at(0).prop('group')).toEqual('Test 1');
    expect(wrapper.find('Group').at(1).prop('group')).toEqual('Test 2');
  });
});
