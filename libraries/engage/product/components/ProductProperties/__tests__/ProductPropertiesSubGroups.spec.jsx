import React from 'react';
import { shallow } from 'enzyme';
import { ProductPropertiesSubGroups } from '../ProductPropertiesSubGroups';

const properties1 = [
  { label: 'test1' },
  { label: 'test2' },
];

const properties2 = [
  {
    label: 'test1',
    subDisplayGroup: 'Test',
  },
  {
    label: 'tes21',
    subDisplayGroup: 'Test',
  },
];

describe('<ProductPropertiesSubGroups />', () => {
  it('should not render if there are not subgroups defined', () => {
    const wrapper = shallow(<ProductPropertiesSubGroups properties={properties1} />);
    expect(wrapper.instance()).toEqual(null);
    expect(wrapper).toMatchSnapshot();
  });

  it('should render a group title and a group', () => {
    const wrapper = shallow(<ProductPropertiesSubGroups properties={properties2} />);
    expect(wrapper.find('ProductPropertiesRowGroup').length).toBe(1);
    expect(wrapper.find('ProductPropertiesRowGroup').prop('group')).toEqual('Test');
    expect(wrapper.find('ProductPropertiesRowGrouped').prop('group')).toEqual('Test');
    expect(wrapper.find('ProductPropertiesRowGrouped').prop('properties')).toEqual(properties2);
    expect(wrapper).toMatchSnapshot();
  });
});
