import React from 'react';
import { shallow } from 'enzyme';
import ResetButton from './index';

const clickMock = jest.fn();

describe('Filter: <ResetButton />', () => {
  it('should render as activated', () => {
    const wrapper = shallow(<ResetButton active onClick={() => {}} />);
    expect(wrapper).toMatchSnapshot();
  });

  it('should render as deactivated', () => {
    const wrapper = shallow(<ResetButton active={false} onClick={() => {}} />);
    expect(wrapper).toMatchSnapshot();
  });

  it('should handle clicks', () => {
    const wrapper = shallow(<ResetButton onClick={clickMock} active />);
    expect(wrapper).toMatchSnapshot();
    wrapper.find('Button').simulate('click');
    expect(clickMock).toHaveBeenCalled();
  });
});
