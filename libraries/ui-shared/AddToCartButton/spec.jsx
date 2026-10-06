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

  describe('checkmark timer', () => {
    beforeEach(() => {
      jest.useFakeTimers();
    });

    afterEach(() => {
      jest.useRealTimers();
    });

    it('does not update the state after the button was unmounted', async () => {
      const consoleError = jest.spyOn(console, 'error').mockImplementation(() => {});
      let resolveClick;
      const onClick = jest.fn(() => new Promise((resolve) => { resolveClick = resolve; }));
      const { unmount, rerender } = render(
        <AddToCartButton onClick={onClick} isLoading={false} isDisabled={false} successCount={0} />
      );

      fireEvent.click(screen.getByRole('button'));
      rerender(
        <AddToCartButton onClick={onClick} isLoading={false} isDisabled={false} successCount={1} />
      );
      unmount();
      await act(async () => {
        resolveClick();
        await flushMicrotasks();
      });
      act(() => {
        jest.advanceTimersByTime(1000);
      });

      expect(consoleError).not.toHaveBeenCalled();
      consoleError.mockRestore();
    });

    it('restarts the timer when another add succeeds during the animation', () => {
      const props = {
        onClick: jest.fn(),
        isLoading: false,
        isDisabled: false,
      };
      const { rerender } = render(<AddToCartButton {...props} successCount={0} />);

      rerender(<AddToCartButton {...props} successCount={1} />);
      act(() => {
        jest.advanceTimersByTime(600);
      });
      rerender(<AddToCartButton {...props} successCount={2} />);
      act(() => {
        jest.advanceTimersByTime(600);
      });

      expect(screen.getByRole('button').className).toMatch(/buttonSuccess/);
    });
  });
});
