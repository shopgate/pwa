import React from 'react';
import { shallow } from 'enzyme';
import ApplyButton from './index';

const clickMock = jest.fn();

describe('Filter: <ApplyButton />', () => {
  it('should render as activated', () => {
    const wrapper = shallow(<ApplyButton active onClick={() => {}} />);
    expect(wrapper).toMatchSnapshot();
  });

  it('should render as deactivated', () => {
    const wrapper = shallow(<ApplyButton active={false} onClick={() => {}} />);
    expect(wrapper).toMatchSnapshot();
  });

  it('should handle clicks', () => {
    const wrapper = shallow(<ApplyButton onClick={clickMock} active />);
    expect(wrapper).toMatchSnapshot();
    wrapper.find('Button').simulate('click');
    expect(clickMock).toHaveBeenCalled();
  });
});
