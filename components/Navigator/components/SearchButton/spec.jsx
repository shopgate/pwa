import React from 'react';
import { shallow } from 'enzyme';
import SearchButton from './index';

describe('<SearchButton />', () => {
  it('should render without any further props', () => {
    const wrapper = shallow(<SearchButton />);

    expect(wrapper).toMatchSnapshot();
  });

  it('should trigger the onClick callback', () => {
    const onClickMock = jest.fn();
    const wrapper = shallow(<SearchButton onClick={onClickMock} />);
    const buttonTag = wrapper.find('Ripple');
    buttonTag.simulate('click');
    buttonTag.props().onComplete();
    expect(onClickMock).toBeCalled();
  });
});
