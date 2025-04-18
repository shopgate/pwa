import React from 'react';
import { shallow } from 'enzyme';
import ResetButton from './index';

const clickMock = jest.fn();

jest.mock('@shopgate/engage/components');

describe('Filter: <ResetButton />', () => {
  it('should render as activated', () => {
    const wrapper = shallow(<ResetButton onClick={() => {}} />);
    expect(wrapper).toMatchSnapshot();
  });

  it('should render as deactivated', () => {
    const wrapper = shallow(<ResetButton disabled onClick={() => {}} />);
    expect(wrapper).toMatchSnapshot();
  });

  it('should handle clicks', () => {
    const wrapper = shallow(<ResetButton onClick={clickMock} />);
    expect(wrapper).toMatchSnapshot();
    wrapper.find('Button').simulate('click');
    expect(clickMock).toHaveBeenCalled();
  });
});
