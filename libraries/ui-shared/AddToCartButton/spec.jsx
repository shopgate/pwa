import React from 'react';
import { mount } from 'enzyme';
import { act } from 'react-dom/test-utils';
import AddToCartButton from './index';

describe('<AddToCartButton />', () => {
  it('should render in loading state and should not be clickable', async () => {
    const spy = jest.fn().mockResolvedValue(true);

    const wrapper = mount(<AddToCartButton
      onClick={spy}
      isLoading
      isOrderable
      isDisabled={false}
    />);

    await act(async () => {
      wrapper.find('button').simulate('click');
    });

    expect(spy).toHaveBeenCalledTimes(0);
    expect(wrapper).toMatchSnapshot();
  });

  it('should render with checkmark icon and should not be clickable the second time', async () => {
    const spy = jest.fn().mockResolvedValue(true);
    const wrapper = mount(<AddToCartButton
      onClick={spy}
      isLoading={false}
      isOrderable
      isDisabled={false}
    />);

    await act(async () => {
      await wrapper.find('button').simulate('click');
      wrapper.update();
    });

    await act(async () => {
      wrapper.find('button').simulate('click');
      wrapper.update();
    });

    expect(spy).toHaveBeenCalledTimes(1);
    expect(wrapper).toMatchSnapshot();
  });

  it('should render with cart icon and should be clickable', async () => {
    const spy = jest.fn().mockResolvedValue(true);
    const wrapper = mount(<AddToCartButton
      onClick={spy}
      isLoading={false}
      isOrderable
      isDisabled={false}
    />);

    await act(async () => {
      wrapper.find('button').simulate('click');
    });

    expect(spy).toHaveBeenCalledTimes(1);
    expect(wrapper).toMatchSnapshot();
  });
});
