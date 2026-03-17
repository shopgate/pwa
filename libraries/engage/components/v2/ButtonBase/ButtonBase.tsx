import { forwardRef } from 'react';
import { makeStyles } from '@shopgate/engage/styles';
import { useReduceMotion } from '@shopgate/engage/a11y/hooks';
import Ripple from './Ripple';
import { usePressRipple } from './hooks';

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
      borderStyle: 'none',
    },
    '&:disabled': {
      pointerEvents: 'none',
      cursor: 'default',
    },
  },
});

export interface ButtonBaseOwnProps {
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
   * Custom class name for the button.
   */
  className?: string;
  /**
   * Override or extend the styles applied to the component.
   */
  classes?: Partial<ReturnType<typeof useStyles>['classes']>;
  children: React.ReactNode;
}

export type ButtonBaseProps = ButtonBaseOwnProps & React.ButtonHTMLAttributes<HTMLButtonElement>;

const supportedButtonTypes = ['button', 'submit', 'reset'] as const;

/**
 * The ButtonBase component serves as a foundational button element that can be extended with
 * additional styles and functionality. It handles basic button behavior, including disabled
 * state and type validation.
 */
const ButtonBase = forwardRef<HTMLButtonElement, ButtonBaseProps>((props, ref) => {
  const {
    disabled = false,
    disableRipple: disableRippleProp = false,
    type = 'button',
    onPointerDown,
    onPointerUp,
    onPointerLeave,
    onPointerCancel,
    className,
    children,
    ...other
  } = props;

  const { classes, cx } = useStyles(undefined, { props: { classes: props.classes } });
  const { ripples, start, end } = usePressRipple();
  const reduceMotion = useReduceMotion();

  const disableRipple = disableRippleProp || reduceMotion;

  const handlePointerDown = (event: React.PointerEvent<HTMLButtonElement>) => {
    if (!disabled && !disableRipple) {
      event.currentTarget.setPointerCapture?.(event.pointerId);
      start(event);
    }

    onPointerDown?.(event);
  };

  const handlePointerUp = (event: React.PointerEvent<HTMLButtonElement>) => {
    if (!disableRipple) {
      end(event.pointerId);
    }

    onPointerUp?.(event);
  };

  const handlePointerCancel = (event: React.PointerEvent<HTMLButtonElement>) => {
    if (!disableRipple) {
      end(event.pointerId);
    }

    onPointerCancel?.(event);
  };

  const handlePointerLeave = (event: React.PointerEvent<HTMLButtonElement>) => {
    if (!disableRipple && event.buttons === 1) {
      end(event.pointerId);
    }

    onPointerLeave?.(event);
  };

  return (
    <button
      ref={ref}
      className={cx(classes.root, className)}
      disabled={disabled}
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerCancel}
      onPointerLeave={handlePointerLeave}
      // eslint-disable-next-line react/button-has-type
      type={supportedButtonTypes.includes(type as (typeof supportedButtonTypes)[number]) ? type : 'button'}
      {...other}
    >
      {children}
      {!disableRipple && <Ripple ripples={ripples} />}
    </button>
  );
});

export default ButtonBase;
