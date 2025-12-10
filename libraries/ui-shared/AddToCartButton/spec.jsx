import React from 'react';
import { mount } from 'enzyme';
import { act } from 'react-dom/test-utils';
import AddToCartButton from './index';

/**
 * Flushes the promise queue.
 * @returns {Promise}
 */
const flushMicrotasks = () => Promise.resolve();

describe('<AddToCartButton />', () => {
  it('should render in loading state and should not be clickable', () => {
    const spy = jest.fn(() => Promise.resolve());

    const wrapper = mount(
      <AddToCartButton
        onClick={spy}
        isLoading
        isOrderable
        isDisabled={false}
      />
    );

    // Click shouldn’t fire when loading
    wrapper.find('button').prop('onClick')();

    expect(wrapper).toMatchSnapshot();
    expect(spy).toHaveBeenCalledTimes(0);
  });

  it('should render with checkmark icon and should not be clickable the second time', async () => {
    const spy = jest.fn(() => Promise.resolve());

    const wrapper = mount(
      <AddToCartButton
        onClick={spy}
        isLoading={false}
        isOrderable
        isDisabled={false}
      />
    );

    // First click triggers async work
    await act(async () => {
      wrapper.find('button').prop('onClick')();
      await flushMicrotasks();
    });
    wrapper.update();

    // Second click should be ignored
    await act(async () => {
      wrapper.find('button').prop('onClick')();
      await flushMicrotasks();
    });
    wrapper.update();

    expect(wrapper).toMatchSnapshot();
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('should render with cart icon and should be clickable', async () => {
    const spy = jest.fn(() => Promise.resolve());

    const wrapper = mount(
      <AddToCartButton
        onClick={spy}
        isLoading={false}
        isOrderable
        isDisabled={false}
      />
    );

    await act(async () => {
      wrapper.find('button').prop('onClick')();
      await flushMicrotasks();
    });
    wrapper.update();

    expect(wrapper).toMatchSnapshot();
    expect(spy).toHaveBeenCalledTimes(1);
  });
});
