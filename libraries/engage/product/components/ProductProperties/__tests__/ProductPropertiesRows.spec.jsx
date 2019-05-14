import React from 'react';
import { shallow } from 'enzyme';
import { ProductPropertiesRows } from '../ProductPropertiesRows';

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
    subDisplayGroup: 'TestGroup',
  },
];

describe('<ProductPropertiesRows />', () => {
  it('should not render if properties are empty', () => {
    const wrapper = shallow(<ProductPropertiesRows properties={[]} />);
    expect(wrapper.instance()).toEqual(null);
    expect(wrapper).toMatchSnapshot();
  });

  it('should render grouped and ungrouped properties', () => {
    const wrapper = shallow(<ProductPropertiesRows properties={properties} />);
    expect(wrapper.find('ProductPropertiesRowUngrouped').length).toEqual(1);
    expect(wrapper.find('ProductPropertiesSubGroups').length).toEqual(1);
    expect(wrapper).toMatchSnapshot();
  });
});
