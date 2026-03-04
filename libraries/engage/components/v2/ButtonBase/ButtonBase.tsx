import { forwardRef } from 'react';
import { makeStyles } from '@shopgate/engage/styles';
import { useReduceMotion } from '@shopgate/engage/a11y/hooks';
import Ripple from './Ripple';
import { useRipple } from './hooks';

const useStyles = makeStyles({
  name: 'ButtonBase',
})({
  root: {
    display: 'inline-flex',
    flexShrink: 0,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    overflow: 'hidden',
    backgroundColor: 'transparent',
    outline: 0,
    border: 0,
    margin: 0,
    borderRadius: 0,
    padding: 0,
    cursor: 'pointer',
    userSelect: 'none',
    verticalAlign: 'middle',
    MozAppearance: 'none',
    WebkitAppearance: 'none',
    textDecoration: 'none',
    color: 'inherit',
    '&::-moz-focus-inner': {
      borderStyle: 'none', // Remove Firefox dotted outline.
    },
    '&:disabled': {
      pointerEvents: 'none', // Disable link interactions
      cursor: 'default',
    },
  },
});

export interface ButtonBaseProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /**
   * If true, the button will be disabled and not respond to user interactions.
   * @default false
   */
  disabled?: boolean;
  /**
   * If true, the ripple effect will be disabled on button interactions.
   * @default false
   */
  disableRipple?: boolean;
  /**
   * Custom class name for the button
   */
  className?: string;
  children: React.ReactNode;
}

const supportedButtonTypes = ['button', 'submit', 'reset'];

/**
 * The ButtonBase component serves as a foundational button element that can be extended with
 * additional styles and functionality. It handles basic button behavior, including disabled
 * state and type validation.
 */
const ButtonBase = forwardRef<HTMLButtonElement, ButtonBaseProps>((props, ref) => {
  const {
    disabled = false,
    disableRipple = false,
    type = 'button',
    onPointerDown,
    className,
    children,
    ...other
  } = props;

  const { classes, cx } = useStyles();
  const { ripples, createRipple } = useRipple();
  const reduceMotion = useReduceMotion();

  const handlePointerDown = (e: React.PointerEvent<HTMLButtonElement>) => {
    if (!disableRipple && !disabled) {
      createRipple(e);
    }

    onPointerDown?.(e);
  };

  return (
    <button
      ref={ref}
      className={cx(classes.root, className)}
      disabled={disabled}
      onPointerDown={handlePointerDown}
      // eslint-disable-next-line react/button-has-type
      type={supportedButtonTypes.includes(type) ? type : 'button'}
      {...other}
    >
      {children}
      {!disableRipple && !reduceMotion && <Ripple ripples={ripples} />}
    </button>
  );
});

export default ButtonBase;
