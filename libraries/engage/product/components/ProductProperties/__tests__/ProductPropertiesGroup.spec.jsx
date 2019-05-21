import React from 'react';
import { shallow } from 'enzyme';
import ProductPropertiesGroup from '../ProductPropertiesGroup';

describe('<ProductPropertiesGroup />', () => {
  it('should render a group title row', () => {
    const wrapper = shallow(<ProductPropertiesGroup group="Test" />);
    expect(wrapper.find('tr').length).toEqual(1);
    expect(wrapper.find('td').length).toEqual(1);
    expect(wrapper.find('td').text()).toEqual('Test');
    expect(wrapper).toMatchSnapshot();
  });
});
