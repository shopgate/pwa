import React, { useContext } from 'react';
import { render, act } from '@testing-library/react';
import ToastProvider from './index';
import ToastContext from './context';

jest.mock('@shopgate/pwa-core', () => ({
  UIEvents: {
    addListener: jest.fn(),
    removeListener: jest.fn(),
    emit: jest.fn(),
  },
}));
jest.mock('@shopgate/pwa-common/helpers/config', () => ({
  themeConfig: { variables: { toast: { duration: 5000 } } },
}));

let ctx;
const Capture = () => {
  ctx = useContext(ToastContext);
  return null;
};

const renderProvider = () => render(
  <ToastProvider>
    <Capture />
  </ToastProvider>
);

const toast = (id, message) => ({
  id,
  message,
});

describe('ToastProvider', () => {
  beforeEach(() => { ctx = undefined; });

  it('appends a toast and applies the default duration', () => {
    renderProvider();
    act(() => { ctx.addToast(toast('a', 'A')); });

    expect(ctx.toasts).toHaveLength(1);
    expect(ctx.toasts[0]).toMatchObject({
      id: 'a',
      message: 'A',
      duration: 5000,
    });
  });

  it('ignores a toast without a message', () => {
    renderProvider();
    act(() => { ctx.addToast({ id: 'x' }); });

    expect(ctx.toasts).toHaveLength(0);
  });

  it('replaces a same-id toast in place, keeping its length and position', () => {
    renderProvider();
    act(() => { ctx.addToast(toast('a', 'A')); });
    act(() => { ctx.addToast(toast('b', 'B')); });

    const before = ctx.toasts;
    act(() => { ctx.addToast(toast('a', 'A2')); });

    expect(ctx.toasts).toHaveLength(2);
    expect(ctx.toasts[0]).toMatchObject(toast('a', 'A2')); // content updated
    expect(ctx.toasts[1]).toMatchObject(toast('b', 'B')); // sibling untouched
    expect(ctx.toasts).not.toBe(before); // new array reference (immutable update)
    expect(ctx.toasts[0]).not.toBe(before[0]); // new head object
  });

  it('removes the first toast (FIFO) on removeToast', () => {
    renderProvider();
    act(() => { ctx.addToast(toast('a', 'A')); });
    act(() => { ctx.addToast(toast('b', 'B')); });
    act(() => { ctx.removeToast(); });

    expect(ctx.toasts).toHaveLength(1);
    expect(ctx.toasts[0]).toMatchObject(toast('b', 'B'));
  });

  it('keeps the context value referentially stable when toasts do not change', () => {
    const { rerender } = renderProvider();
    act(() => { ctx.addToast(toast('a', 'A')); });

    const provided = ctx;
    // Re-render the provider without changing the queue.
    rerender(
      <ToastProvider>
        <Capture />
      </ToastProvider>
    );

    expect(ctx).toBe(provided); // same context object → consumers don't needlessly re-render
  });
});
