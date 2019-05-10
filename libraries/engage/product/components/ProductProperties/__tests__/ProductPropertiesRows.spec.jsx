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
];

describe('<ProductPropertiesRows />', () => {
  it('should not render if properties are empty', () => {
    const wrapper = shallow(<ProductPropertiesRows properties={[]} />);
    expect(wrapper.instance()).toEqual(null);
    expect(wrapper).toMatchSnapshot();
  });

  it('should render the properties as table rows', () => {
    const wrapper = shallow(<ProductPropertiesRows properties={properties} />);
    expect(wrapper.find('tr').length).toEqual(2);
    expect(wrapper.find('tr').at(0).childAt(0).text()).toEqual('test1');
    expect(wrapper.find('tr').at(0).childAt(1).text()).toEqual('123');
    expect(wrapper.find('tr').at(1).childAt(0).text()).toEqual('test2');
    expect(wrapper.find('tr').at(1).childAt(1).text()).toEqual('456');
    expect(wrapper).toMatchSnapshot();
  });
});
