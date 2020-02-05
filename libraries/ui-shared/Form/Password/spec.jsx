import React from 'react';
import { mount } from 'enzyme';
import Password from './index';

const inputProps = {
  name: 'test-input',
};

describe('<Password>', () => {
  it('should render a password field', () => {
    const wrapper = mount(<Password {...inputProps} />);

    expect(wrapper).toMatchSnapshot();
    expect(wrapper.find('input[type="password"]').length).toBe(1);
  });

  it('should trigger the onChange callback', () => {
    const onChangeMock = jest.fn();

    const wrapper = mount(<Password {...inputProps} onChange={onChangeMock} />);

    wrapper.find('input').simulate('change', { target: { value: 'a' } });

    expect(onChangeMock).toHaveBeenCalledTimes(2);
    expect(wrapper.find('input').props().value).toEqual('a');
  });

  it('should toggle password visibility', () => {
    const wrapper = mount(<Password {...inputProps} />);

    const input = wrapper.find('ToggleIcon');

    expect(wrapper.find('input[type="password"]').length).toBe(1);

    input.simulate('click');
    expect(wrapper.find('input[type="text"]').length).toBe(1);
  });
});
