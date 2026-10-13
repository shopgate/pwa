import {
  useCallback, useEffect, useRef, useState,
} from 'react';
import type { ChangeEvent, FocusEvent, KeyboardEvent } from 'react';
import { ButtonBase } from '@shopgate/engage/components/v2';
import { i18n } from '@shopgate/engage/core/helpers/i18n';
import { broadcastLiveMessage as broadcast } from '@shopgate/engage/a11y';
import { makeStyles } from '@shopgate/engage/styles';

const DEFAULT_MAX = 99;

export interface QuantityStepperProps {
  value: number;
  onChange: (quantity: number) => void;
  min?: number;
  max?: number;
  disabled?: boolean;
  className?: string;
}

const broadcastLiveMessage = broadcast as unknown as (
  message: string,
  options: { params: Record<string, number> }
) => void;

/**
 * Keeps a quantity within its limits.
 * @param value The value to clamp.
 * @param min The lower limit.
 * @param max The upper limit.
 * @returns The value within the limits.
 */
const clampQuantity = (value: number, min: number, max: number) => (
  Math.min(Math.max(value, min), max)
);

const DIGITS = '0123456789';

/**
 * Checks whether a text only consists of digits.
 * @param text The text to check.
 * @returns Whether the text is empty or made of digits only.
 */
const isDigits = (text: string) => Array.from(text).every(char => DIGITS.includes(char));

const TOUCH_TARGET = 44;

const useStyles = makeStyles({ name: 'QuantityStepper' })(theme => ({
  root: {
    display: 'inline-flex',
    alignItems: 'stretch',
    flexShrink: 0,
    background: theme.palette.background.surface,
    border: `1px solid ${theme.components.separatorLine.borderColor}`,
    borderRadius: theme.shape.borderRadius,
    overflow: 'hidden',
    color: theme.palette.text.primary,
    '&:focus-within': {
      borderColor: theme.palette.text.primary,
    },
  },
  button: {
    minWidth: TOUCH_TARGET,
    minHeight: TOUCH_TARGET,
    fontSize: theme.typography.h5.fontSize,
    fontWeight: theme.typography.fontWeightMedium,
    lineHeight: 1,
    color: 'inherit',
    '&:disabled, &[aria-disabled="true"]': {
      color: theme.palette.action.disabled,
    },
    '&:focus-visible': {
      outline: `2px solid ${theme.palette.text.primary}`,
      outlineOffset: -2,
    },
  },
  input: {
    width: '2.5em',
    padding: 0,
    border: 0,
    borderLeft: `1px solid ${theme.components.separatorLine.borderColor}`,
    borderRight: `1px solid ${theme.components.separatorLine.borderColor}`,
    borderRadius: 0,
    background: 'transparent',
    color: 'inherit',
    font: 'inherit',
    fontWeight: theme.typography.fontWeightBold,
    textAlign: 'center',
    appearance: 'textfield',
    MozAppearance: 'textfield',
    '&::-webkit-outer-spin-button, &::-webkit-inner-spin-button': {
      WebkitAppearance: 'none',
      margin: 0,
    },
    '&:disabled': {
      color: theme.palette.action.disabled,
    },
    '&:focus-visible': {
      outline: `2px solid ${theme.palette.text.primary}`,
      outlineOffset: -2,
    },
  },
}));

/**
 * A quantity picker with a decrease button, a number field and an increase button. The field
 * selects its value on focus, caps values above the maximum while typing and settles on a valid
 * value on blur and on enter.
 * @returns The stepper.
 */
const QuantityStepper = ({
  value,
  onChange,
  min = 1,
  max = DEFAULT_MAX,
  disabled = false,
  className,
}: QuantityStepperProps) => {
  const { classes, cx } = useStyles();
  const [input, setInput] = useState(String(value));
  const focused = useRef(false);

  const announced = useRef(value);

  useEffect(() => {
    if (!focused.current) {
      setInput(String(value));
      announced.current = value;
    }
  }, [value]);

  const announce = useCallback((next: number) => {
    if (next === announced.current) {
      return;
    }

    broadcastLiveMessage(
      next > announced.current ? 'product.increased_quantity_to' : 'product.decreased_quantity_to',
      { params: { quantity: next } }
    );
    announced.current = next;
  }, []);

  const change = useCallback((next: number, silent = false) => {
    if (next !== value) {
      onChange(next);
    }

    if (!silent) {
      announce(next);
    }
  }, [announce, onChange, value]);

  const maxDigits = String(max).length;

  const handleInput = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    const raw = event.target.value;

    if (!isDigits(raw) || raw.length > maxDigits) {
      return;
    }

    if (raw === '') {
      setInput('');
      return;
    }

    const next = Math.min(parseInt(raw, 10), max);

    if (next === 0 && min > 0) {
      return;
    }

    setInput(String(next));

    if (next >= min) {
      change(next, true);
    }
  }, [change, max, maxDigits, min]);

  const commit = useCallback(() => {
    const parsed = parseInt(input, 10);
    const next = Number.isNaN(parsed) ? value : clampQuantity(parsed, min, max);
    setInput(String(next));
    change(next);
  }, [change, input, max, min, value]);

  const handleFocus = useCallback((event: FocusEvent<HTMLInputElement>) => {
    focused.current = true;
    event.target.select();
  }, []);

  const handleBlur = useCallback(() => {
    focused.current = false;
    commit();
  }, [commit]);

  const handleKeyDown = useCallback((event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      commit();
      event.currentTarget.select();
    }
  }, [commit]);

  const canDecrease = !disabled && value > min;
  const canIncrease = !disabled && value < max;

  return (
    <div className={cx(classes.root, 'engage__quantity-stepper', className)}>
      <ButtonBase
        className={cx(classes.button, 'engage__quantity-stepper__button')}
        disabled={disabled}
        aria-disabled={!canDecrease || undefined}
        onClick={() => canDecrease && change(value - 1)}
        aria-label={i18n.text('product.decrease_quantity')}
      >
        −
      </ButtonBase>
      <input
        className={cx(classes.input, 'engage__quantity-stepper__input')}
        type="number"
        inputMode="numeric"
        pattern="[0-9]*"
        min={min}
        max={max}
        value={input}
        disabled={disabled}
        onChange={handleInput}
        onFocus={handleFocus}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        aria-label={i18n.text('product.quantity')}
      />
      <ButtonBase
        className={cx(classes.button, 'engage__quantity-stepper__button')}
        disabled={disabled}
        aria-disabled={!canIncrease || undefined}
        onClick={() => canIncrease && change(value + 1)}
        aria-label={i18n.text('product.increase_quantity')}
      >
        +
      </ButtonBase>
    </div>
  );
};

export default QuantityStepper;
