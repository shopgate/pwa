import React from 'react';
import { shallow } from 'enzyme';
import ApplyButton from './index';

const clickMock = jest.fn();

jest.mock('@shopgate/engage/core', () => ({
  withWidgetSettings: function withWidgetSettings(Comp) {
    return props => (<Comp widgetSettings={{}} {...props} />);
  },
}));

describe('Filter: <ApplyButton />', () => {
  it('should render as activated', () => {
    const wrapper = shallow(<ApplyButton active onClick={() => {}} />).dive();
    expect(wrapper).toMatchSnapshot();
  });

  it('should render as deactivated', () => {
    const wrapper = shallow(<ApplyButton active={false} onClick={() => { }} />).dive();
    expect(wrapper).toMatchSnapshot();
  });

  it('should handle clicks', () => {
    const wrapper = shallow(<ApplyButton onClick={clickMock} active />).dive();
    expect(wrapper).toMatchSnapshot();
    wrapper.find('Button').simulate('click');
    expect(clickMock).toHaveBeenCalled();
  });
});
