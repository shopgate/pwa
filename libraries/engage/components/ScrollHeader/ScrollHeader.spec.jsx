import {
  act, fireEvent, render, screen,
} from '@testing-library/react';
import ScrollHeader from './index';

let mockScrollOptions = null;

jest.mock('@shopgate/engage/core/hooks', () => ({
  useRoute: () => ({ visible: true }),
  useScrollDirectionChange: (options) => {
    mockScrollOptions = options;
  },
}));
jest.mock('@shopgate/engage/a11y/hooks', () => ({ useReduceMotion: () => false }));

describe('<ScrollHeader />', () => {
  it('shows the content again when hiding on scroll is turned off', () => {
    const onChange = jest.fn();
    const { rerender } = render(
      <ScrollHeader hideOnScroll onChange={onChange}><span>bar</span></ScrollHeader>
    );

    act(() => mockScrollOptions.onScrollDown());
    expect(onChange).toHaveBeenLastCalledWith(false);

    rerender(
      <ScrollHeader hideOnScroll={false} onChange={onChange}><span>bar</span></ScrollHeader>
    );
    expect(onChange).toHaveBeenLastCalledWith(true);
    expect(mockScrollOptions.enabled).toBe(false);
  });

  it('shows the content again when an element inside receives focus', () => {
    const onChange = jest.fn();
    render(
      <ScrollHeader hideOnScroll onChange={onChange}>
        <button type="button">filter</button>
      </ScrollHeader>
    );

    act(() => mockScrollOptions.onScrollDown());
    expect(onChange).toHaveBeenLastCalledWith(false);

    fireEvent.focus(screen.getByRole('button', { name: 'filter' }));
    expect(onChange).toHaveBeenLastCalledWith(true);
  });

  it('does not hide again when hiding on scroll is turned off and on', () => {
    const onChange = jest.fn();
    const { rerender } = render(
      <ScrollHeader hideOnScroll onChange={onChange}><span>bar</span></ScrollHeader>
    );

    act(() => mockScrollOptions.onScrollDown());
    rerender(
      <ScrollHeader hideOnScroll={false} onChange={onChange}><span>bar</span></ScrollHeader>
    );
    rerender(
      <ScrollHeader hideOnScroll onChange={onChange}><span>bar</span></ScrollHeader>
    );

    expect(onChange).toHaveBeenLastCalledWith(true);
  });

  it('keeps the content while an element inside has focus', () => {
    const onChange = jest.fn();
    render(
      <ScrollHeader hideOnScroll onChange={onChange}>
        <button type="button">filter</button>
      </ScrollHeader>
    );

    act(() => screen.getByRole('button', { name: 'filter' }).focus());
    act(() => mockScrollOptions.onScrollDown());

    expect(onChange).toHaveBeenLastCalledWith(true);
  });
});
