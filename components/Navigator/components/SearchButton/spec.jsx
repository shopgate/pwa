import React from 'react';
import { shallow } from 'enzyme';
import SearchButton from './SearchButton';

describe('<SearchButton />', () => {
  it('should render without any further props', () => {
    const wrapper = shallow(
      <SearchButton />
    );

    expect(wrapper).toMatchSnapshot();
  });

  it('should trigger the onClick callback', () => {
    const onClickMock = jest.fn();
    const wrapper = shallow(
      <SearchButton onClick={onClickMock} />
    );
    const buttonTag = wrapper.find('button');
    buttonTag.simulate('click', { preventDefault: () => {} });
    expect(onClickMock).toBeCalled();
  });
});
