import React from 'react';
import { mount } from 'enzyme';
import { UnwrappedSearchButton } from './index';

describe('<SearchButton />', () => {
  beforeEach(() => {
    jest.resetModules();
  });

  it('should render without any further props', () => {
    const wrapper = mount(<UnwrappedSearchButton toggleSearchField={() => {}} searchActive />);
    expect(wrapper).toMatchSnapshot();
  });

  it('should trigger the onClick callback', () => {
    const mockedOnClick = jest.fn();
    const wrapper = mount(<UnwrappedSearchButton toggleSearchField={mockedOnClick} searchActive />);
    const buttonTag = wrapper.find('Ripple');
    buttonTag.simulate('click');
    wrapper.update();

    expect(mockedOnClick).toHaveBeenCalledTimes(1);
  });
});
