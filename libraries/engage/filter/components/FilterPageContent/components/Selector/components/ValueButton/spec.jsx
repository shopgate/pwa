import React from 'react';
import { shallow } from 'enzyme';
import ValueButton from './index';

const onClick = jest.fn();

describe('<ValueButton />', () => {
  it('should render as inactive', () => {
    const wrapper = shallow(<ValueButton id="someid" label="somelabel" />);
    expect(wrapper).toMatchSnapshot();
  });

  it('should render as active', () => {
    const wrapper = shallow(<ValueButton id="someid" label="somelabel" isActive />);
    expect(wrapper).toMatchSnapshot();
  });

  it('should handle click event', () => {
    const wrapper = shallow(<ValueButton id="someid" label="somelabel" onClick={onClick} />);
    wrapper.simulate('click');
    expect(wrapper).toMatchSnapshot();
    expect(onClick).toHaveBeenCalledTimes(1);
  });
});
