import React from 'react';
import { mount } from 'enzyme';
import Chip from '../Chip';

describe('<Chip />', () => {
  it('should render a tag', () => {
    const wrapper = mount(<Chip>text</Chip>);

    expect(wrapper).toMatchSnapshot();
    expect(wrapper.find('button').length).toEqual(2);
    expect(wrapper.find('button').at(1).text()).toEqual('text');
  });
});

describe('<Chip />', () => {
  it('should render a without removable icon', () => {
    const wrapper = mount(<Chip removable={false}>text</Chip>);

    expect(wrapper).toMatchSnapshot();
    expect(wrapper.find('button').length).toEqual(1);
    expect(wrapper.find('button').at(0).text()).toEqual('text');
  });
});
