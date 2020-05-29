import React from 'react';
import { mount } from 'enzyme';
import Row from '../Row';

describe('<Row />', () => {
  it('should render as expected', () => {
    const wrapper = mount(<Row label="TestLabel" value="TestValue" />);
    expect(wrapper.find('td').at(0).text()).toEqual('TestLabel');
    expect(wrapper.find('td').at(1).text()).toEqual('TestValue');
    expect(wrapper).toMatchSnapshot();
  });
});
