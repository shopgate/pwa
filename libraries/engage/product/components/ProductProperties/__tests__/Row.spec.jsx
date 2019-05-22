import React from 'react';
import { shallow } from 'enzyme';
import Row from '../Row';

describe('<Row />', () => {
  it('should render as expected', () => {
    const wrapper = shallow(<Row label="TestLabel" value="TestValue" />);
    expect(wrapper.find('td').at(0).text()).toEqual('TestLabel');
    expect(wrapper.find('td').at(1).text()).toEqual('TestValue');
    expect(wrapper).toMatchSnapshot();
  });
});
