import { useState } from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import QuantityStepper from './QuantityStepper';

jest.mock('@shopgate/engage/core/helpers/i18n', () => ({ i18n: { text: (key: string) => key } }));
jest.mock('@shopgate/engage/a11y', () => ({ broadcastLiveMessage: jest.fn() }));
jest.mock('@shopgate/engage/components/v2', () => ({
  ButtonBase: ({ children, ...props }: Record<string, unknown> & { children: unknown }) => (
    <button type="button" {...props}>{children as string}</button>
  ),
}));

const onChangeSpy = jest.fn();

interface HarnessProps {
  min?: number;
  max?: number;
  initial?: number;
}

/**
 * Renders the stepper with its own state, like the add to cart bar does.
 * @param props The limits and the initial value.
 * @param props.min The lower limit.
 * @param props.max The upper limit.
 * @param props.initial The initial value.
 * @returns The stepper.
 */
const Harness = ({ min = 1, max = 99, initial = 1 }: HarnessProps) => {
  const [value, setValue] = useState(initial);
  return (
    <QuantityStepper
      value={value}
      min={min}
      max={max}
      onChange={(next) => {
        onChangeSpy(next);
        setValue(next);
      }}
    />
  );
};

const input = () => screen.getByRole('spinbutton') as HTMLInputElement;

describe('<QuantityStepper />', () => {
  beforeEach(() => {
    onChangeSpy.mockClear();
  });

  it('steps up and down within the limits', () => {
    render(<Harness min={2} max={3} initial={2} />);
    const decrease = screen.getByRole('button', { name: 'product.decrease_quantity' });
    const increase = screen.getByRole('button', { name: 'product.increase_quantity' });

    expect(decrease).toHaveAttribute('aria-disabled', 'true');
    expect(decrease).toBeEnabled();
    fireEvent.click(decrease);
    expect(input().value).toBe('2');
    fireEvent.click(increase);
    expect(input().value).toBe('3');
    expect(increase).toHaveAttribute('aria-disabled', 'true');
    fireEvent.click(increase);
    expect(input().value).toBe('3');
    fireEvent.click(decrease);
    expect(input().value).toBe('2');
    expect(onChangeSpy.mock.calls).toEqual([[3], [2]]);
  });

  it('keeps the value on focus and caps values above the maximum while typing', () => {
    render(<Harness max={20} />);

    fireEvent.focus(input());
    expect(input().value).toBe('1');
    fireEvent.change(input(), { target: { value: '35' } });
    expect(input().value).toBe('20');
    expect(onChangeSpy).toHaveBeenLastCalledWith(20);
  });

  it('ignores more digits than the maximum has', () => {
    render(<Harness />);

    fireEvent.focus(input());
    fireEvent.change(input(), { target: { value: '123' } });
    expect(input().value).toBe('1');
    expect(onChangeSpy).not.toHaveBeenCalled();
  });

  it('takes over the typed value on enter and keeps the focus in the field', () => {
    render(<Harness min={3} initial={5} />);

    input().focus();
    fireEvent.change(input(), { target: { value: '1' } });
    fireEvent.keyDown(input(), { key: 'Enter' });

    expect(input().value).toBe('3');
    expect(onChangeSpy).toHaveBeenLastCalledWith(3);
    expect(input()).toHaveFocus();
  });

  it('restores the last value when the field is left empty', () => {
    render(<Harness initial={4} />);

    fireEvent.focus(input());
    fireEvent.change(input(), { target: { value: '' } });
    fireEvent.blur(input());
    expect(input().value).toBe('4');
    expect(onChangeSpy).not.toHaveBeenCalled();
  });

  it('raises a value below the minimum on blur', () => {
    render(<Harness min={3} initial={5} />);

    fireEvent.focus(input());
    fireEvent.change(input(), { target: { value: '1' } });
    expect(onChangeSpy).not.toHaveBeenCalled();
    fireEvent.blur(input());
    expect(input().value).toBe('3');
    expect(onChangeSpy).toHaveBeenLastCalledWith(3);
  });

  it('shows an outside change of the value', () => {
    const { rerender } = render(<QuantityStepper value={1} onChange={jest.fn()} />);

    rerender(<QuantityStepper value={6} onChange={jest.fn()} />);
    expect(input().value).toBe('6');
  });
});
