import React from 'react';
import { mount } from 'enzyme';
import { act } from 'react-dom/test-utils';
import { render, screen, fireEvent } from '@testing-library/react';
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

  describe('successCount', () => {
    it('shows the checkmark when the count increases', () => {
      const onClick = jest.fn();
      const { rerender } = render(
        <AddToCartButton onClick={onClick} isLoading={false} isDisabled={false} successCount={0} />
      );

      expect(screen.getByRole('button').className).toMatch(/buttonReady/);

      rerender(
        <AddToCartButton onClick={onClick} isLoading={false} isDisabled={false} successCount={1} />
      );

      expect(screen.getByRole('button').className).toMatch(/buttonSuccess/);
      expect(onClick).not.toHaveBeenCalled();
    });

    it('does not animate when the count stays the same', () => {
      const props = {
        onClick: jest.fn(),
        isLoading: false,
        isDisabled: false,
        successCount: 2,
      };
      const { rerender } = render(<AddToCartButton {...props} />);
      rerender(<AddToCartButton {...props} />);

      expect(screen.getByRole('button').className).toMatch(/buttonReady/);
    });

    it('does not animate a click when onClick returns false', () => {
      const onClick = jest.fn(() => false);
      render(<AddToCartButton onClick={onClick} isLoading={false} isDisabled={false} />);

      fireEvent.click(screen.getByRole('button'));

      expect(onClick).toHaveBeenCalledTimes(1);
      expect(screen.getByRole('button').className).toMatch(/buttonReady/);
    });
  });
});
