import React from 'react';
import { mount } from 'enzyme';
import AddToCartButton from './index';

/**
 * Flushes the promise queue.
 * @returns {Promise}
 */
const flushPromises = () => new Promise(resolve => setImmediate(resolve));

describe('<AddToCartButton />', () => {
  it('should render in loading state and should not be clickable', () => {
    const spy = jest.fn(() => new Promise(resolve => resolve()));

    const wrapper = mount(<AddToCartButton
      onClick={spy}
      isLoading
      isOrderable
      isDisabled={false}
    />);
    wrapper.find('button').prop('onClick')();

    expect(wrapper).toMatchSnapshot();
    expect(spy).toHaveBeenCalledTimes(0);
  });

  it('should render with checkmark icon and should not be clickable the second time', async () => {
    const spy = jest.fn(() => new Promise(resolve => resolve()));
    const wrapper = mount(<AddToCartButton
      onClick={spy}
      isLoading={false}
      isOrderable
      isDisabled={false}
    />);

    wrapper.find('button').prop('onClick')();
    wrapper.update();
    await flushPromises();

    wrapper.find('button').prop('onClick')();
    wrapper.update();
    await flushPromises();

    expect(wrapper).toMatchSnapshot();
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('should render with cart icon and should be clickable', () => {
    const spy = jest.fn(() => new Promise(resolve => resolve()));
    const wrapper = mount(<AddToCartButton
      onClick={spy}
      isLoading={false}
      isOrderable
      isDisabled={false}
    />);
    wrapper.find('button').prop('onClick')();

    expect(wrapper).toMatchSnapshot();
    expect(spy).toHaveBeenCalledTimes(1);
  });
});
