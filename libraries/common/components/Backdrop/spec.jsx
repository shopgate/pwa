import React from 'react';
import { shallow, mount } from 'enzyme';
import Backdrop from './index';

describe('<Backdrop />', () => {
  let mockOpen;

  beforeEach(() => {
    mockOpen = jest.fn();
  });

  it('should render', () => {
    const wrapper = shallow(<Backdrop isVisible />);
    expect(wrapper).toMatchSnapshot();
  });

  it('should execute callback when Backdrop is clicked', () => {
    const wrapper = mount(<Backdrop isVisible onClick={mockOpen} />);
    wrapper.find('div').simulate('click');
    expect(mockOpen).toBeCalled();
  });
});
