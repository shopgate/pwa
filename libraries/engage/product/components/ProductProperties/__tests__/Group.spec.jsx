import React from 'react';
import { shallow } from 'enzyme';
import Group from '../Group';

describe('<Group />', () => {
  it('should render a group title row', () => {
    const wrapper = shallow(<Group group="Test" />);
    expect(wrapper.find('tr').length).toEqual(1);
    expect(wrapper.find('td').length).toEqual(1);
    expect(wrapper.find('td').text()).toEqual('Test');
    expect(wrapper).toMatchSnapshot();
  });
});
