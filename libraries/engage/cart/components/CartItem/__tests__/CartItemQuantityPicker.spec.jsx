import React from 'react';
import { render, screen, fireEvent } from '@shopgate/pwa-unit-test/rtlUtils';
import { CartItemQuantityPicker } from '../CartItemQuantityPicker';

jest.mock('@shopgate/engage/components/QuantityInput', () => {
  const ReactActual = jest.requireActual('react');

  return ReactActual.forwardRef((props, ref) => {
    const {
      value,
      onClick,
      onFocus,
      onBlur,
      unit,
      maxDecimals,
      disabled,
      className,
      ariaLabel,
    } = props;
    const [internalValue, setInternalValue] = ReactActual.useState(String(value));

    ReactActual.useEffect(() => {
      setInternalValue(String(value));
    }, [value]);

    return (
      <input
        ref={ref}
        type="text"
        value={internalValue}
        onClick={onClick}
        onFocus={onFocus}
        onChange={event => setInternalValue(event.target.value)}
        onBlur={event => onBlur(event, Number(internalValue))}
        data-testid="quantity-input"
        data-unit={unit || ''}
        data-max-decimals={String(maxDecimals)}
        disabled={disabled}
        className={className}
        aria-label={ariaLabel}
      />
    );
  });
});

describe('<CartItemQuantityPicker />', () => {
  it('should have an amount of 1 by default', () => {
    render(<CartItemQuantityPicker />);

    expect(screen.getByTestId('quantity-input')).toHaveValue('1');
  });

  it('should have an amount of 3 via prop', () => {
    render(<CartItemQuantityPicker quantity={3} />);

    expect(screen.getByTestId('quantity-input')).toHaveValue('3');
  });

  it('should have an amount of 0, if 0 is supplied', () => {
    render(<CartItemQuantityPicker quantity={0} />);

    expect(screen.getByTestId('quantity-input')).toHaveValue('0');
  });

  it.skip('should reset the amount to 1 if set to lower than 0', () => {
    render(<CartItemQuantityPicker quantity={-1} />);

    expect(screen.getByTestId('quantity-input')).toHaveValue('1');
  });

  it.skip('should fall back to the previous value when the last value was invalid', () => {
    render(<CartItemQuantityPicker quantity={124} />);
    const input = screen.getByTestId('quantity-input');
    fireEvent.change(input, { target: { value: '124.5' } });

    expect(input).toHaveValue('124');
  });

  describe('Given editMode prop is handled correctly', () => {
    it('should focus the input, if the editMode is enabled via prop', () => {
      const { rerender } = render(<CartItemQuantityPicker />);
      const inputNode = screen.getByTestId('quantity-input');
      jest.spyOn(inputNode, 'focus');

      rerender(<CartItemQuantityPicker editMode />);

      expect(inputNode.focus).toHaveBeenCalled();
    });

    it('should not call focus when editMode is false', () => {
      const { rerender } = render(<CartItemQuantityPicker />);
      const inputNode = screen.getByTestId('quantity-input');
      jest.spyOn(inputNode, 'focus');

      rerender(<CartItemQuantityPicker editMode={false} />);

      expect(inputNode.focus).not.toHaveBeenCalled();
    });
  });

  describe('Given onChange callback is triggered correctly', () => {
    let input;
    let onChangeMock;

    beforeEach(() => {
      onChangeMock = jest.fn();

      render(<CartItemQuantityPicker quantity={2} onChange={onChangeMock} />);
      input = screen.getByTestId('quantity-input');
    });

    it('should trigger the callback when the input changed', () => {
      fireEvent.focus(input);
      fireEvent.change(input, { target: { value: '123' } });
      fireEvent.blur(input);

      expect(onChangeMock.mock.calls.length).toBe(1);
      expect(onChangeMock).toHaveBeenCalledWith(123);
    });

    it('should not trigger the callback when the input didn\'t change', () => {
      fireEvent.focus(input);
      fireEvent.change(input, { target: { value: '2' } });
      fireEvent.blur(input);

      expect(onChangeMock.mock.calls.length).toBe(0);
    });
  });

  describe('Given onToggleEditMode callback is triggered correctly', () => {
    let input;
    let onToggleEditModeMock;

    beforeEach(() => {
      onToggleEditModeMock = jest.fn();

      render(<CartItemQuantityPicker onToggleEditMode={onToggleEditModeMock} />);
      input = screen.getByTestId('quantity-input');
    });

    it('should trigger the callback when the input was focused', () => {
      fireEvent.focus(input);

      expect(onToggleEditModeMock).lastCalledWith(true);
    });

    it('should trigger the callback when the input was blurred', () => {
      fireEvent.focus(input);
      fireEvent.blur(input);

      expect(onToggleEditModeMock).lastCalledWith(false);
    });
  });
});
