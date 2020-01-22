import React from 'react';
import { mount } from 'enzyme';
import ToggleIcon from './index';
import VisibilityIcon from '../icons/VisibilityIcon';
import VisibilityOffIcon from '../icons/VisibilityOffIcon';

const inputProps = {
  onIcon: <VisibilityIcon />,
  offIcon: <VisibilityOffIcon />,
};

describe('<ToggleIcon>', () => {
  it('should render a toggle icon', () => {
    const wrapper = mount(<ToggleIcon {...inputProps} />);

    expect(wrapper).toMatchSnapshot();
    expect(wrapper.find('VisibilityIcon').length).toBe(1);
    expect(wrapper.find('VisibilityOffIcon').length).toBe(0);
  });

  it('should render a toggle icon with false as default', () => {
    const wrapper = mount(<ToggleIcon {...inputProps} on={false} />);

    expect(wrapper).toMatchSnapshot();
    expect(wrapper.find('VisibilityIcon').length).toBe(0);
    expect(wrapper.find('VisibilityOffIcon').length).toBe(1);
  });

  it('should trigger the toggleHandler callback', () => {
    const mockToggleHandler = jest.fn();

    const wrapper = mount(<ToggleIcon {...inputProps} toggleHandler={mockToggleHandler} />);

    wrapper.find('div').simulate('click');
    expect(wrapper).toMatchSnapshot();
    expect(mockToggleHandler.mock.calls.length).toBe(1);
  });
});
