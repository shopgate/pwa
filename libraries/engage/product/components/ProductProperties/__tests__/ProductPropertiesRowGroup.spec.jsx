import React from 'react';
import { shallow } from 'enzyme';
import { ProductPropertiesRowGroup } from '../ProductPropertiesRowGroup';

describe('<ProductPropertiesRowGroup />', () => {
  it('should render a group title row', () => {
    const wrapper = shallow(<ProductPropertiesRowGroup group="Test" />);
    expect(wrapper.find('tr').length).toEqual(1);
    expect(wrapper.find('td').length).toEqual(1);
    expect(wrapper.find('td').text()).toEqual('Test');
    expect(wrapper).toMatchSnapshot();
  });
});
