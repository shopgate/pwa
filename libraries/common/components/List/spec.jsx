/* eslint-disable no-console */
import React from 'react';
import { shallow } from 'enzyme';
import List from './index';

console.error = jest.fn();

describe('<List />', () => {
  const children = [
    <List.Item key="0" />,
    <List.Item key="1" />,
    <List.Item key="2" />,
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders with children', () => {
    const numChildren = children.length;
    const wrapper = shallow(<List>{children}</List>);

    expect(wrapper).toMatchSnapshot();
    expect(wrapper.find(List.Item).length).toBe(numChildren);
    expect(console.error).not.toHaveBeenCalled();
  });

  it('renders without children', () => {
    const wrapper = shallow(<List />);

    expect(wrapper).toMatchSnapshot();
    expect(wrapper.find(List.Item).length).toBe(0);
    expect(console.error).toHaveBeenCalledTimes(1);
  });
});
/* eslint-enable no-console */
