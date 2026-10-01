import React, {
  useCallback, useEffect, useRef, useState,
} from 'react';
import spring from 'css-spring';
import { withForwardedRef } from '@shopgate/engage/core';
import { keyframes, makeStyles, useTheme } from '@shopgate/engage/styles';
import CartPlusIcon from '../icons/CartPlusIcon';
import TickIcon from '../icons/TickIcon';
import IndicatorCircle from '../IndicatorCircle';

const DEFAULT_BUTTON_SIZE = 40;
const DEFAULT_ICON_SIZE = 20;

const springOptions = {
  stiffness: 381.47,
  damping: 15,
};

const springFromTopKeyframes = keyframes(spring(
  { transform: 'translate3d(0, 300%, 0)' },
  { transform: 'translate3d(0, -50%, 0)' },
  springOptions
));

const springFromBottomKeyframes = keyframes(spring(
  { transform: 'translate3d(0, -300%, 0)' },
  { transform: 'translate3d(0, -50%, 0)' },
  springOptions
));

const springToTopKeyframes = keyframes(spring(
  { transform: 'translate3d(0, -50%, 0)' },
  { transform: 'translate3d(0, 300%, 0)' },
  springOptions
));

const springToBottomKeyframes = keyframes(spring(
  { transform: 'translate3d(0, -50%, 0)' },
  { transform: 'translate3d(0, -300%, 0)' },
  springOptions
));

const useStyles = makeStyles()(theme => ({
  springFromBottom: {
    animation: `${springFromBottomKeyframes} 600ms`,
  },
  springFromTop: {
    animation: `${springFromTopKeyframes} 600ms`,
  },
  springToTop: {
    animation: `${springToTopKeyframes} 600ms`,
  },
  springToBottom: {
    animation: `${springToBottomKeyframes} 600ms`,
  },
  icon: {
    transition: 'opacity 450ms cubic-bezier(0.4, 0.0, 0.2, 1)',
    opacity: 1,
    position: 'absolute',
    display: 'flex',
    left: '50%',
    marginLeft: '-0.5em',
  },
  spinnerIcon: {
    left: '50%',
    top: '50%',
    marginTop: -32 / 2,
    marginLeft: -32 / 2,
  },
  buttonReady: {
    background: theme.components.ctaButton.background,
    color: theme.contrastColor(theme.components.ctaButton.background),
  },
  buttonSuccess: {
    background: theme.contrastColor(theme.components.ctaButton.background),
    color: theme.components.ctaButton.background,
  },
  buttonDisabled: {
    background: theme.palette.action.disabledBackground,
    color: theme.contrastColor(theme.palette.action.disabledBackground),
    boxShadow: '0 3px 4px rgba(0, 0, 0, 0.13)',
  },
}));

const getWrapperStyle = (bSize: number, iSize: number): React.CSSProperties => ({
  transition: 'background 450ms cubic-bezier(0.4, 0.0, 0.2, 1)',
  borderRadius: '50%',
  width: bSize,
  height: bSize,
  position: 'relative',
  fontSize: iSize,
  outline: 0,
  paddingLeft: (bSize - iSize) / 2,
  paddingRight: (bSize - iSize) / 2,
  zIndex: 2,
  overflow: 'hidden',
  flexShrink: 0,
});

export interface AddToCartButtonProps {
  /**
   * Whether the button is disabled.
   */
  isDisabled: boolean;
  /**
   * Shows a spinner instead of the icons and ignores clicks.
   */
  isLoading: boolean;
  /**
   * Called on click. `false` skips the checkmark animation, a promise delays it until it
   * resolves.
   */
  onClick: (event: React.MouseEvent<HTMLButtonElement>) => unknown;
  /**
   * Hides the button from assistive technology.
   */
  'aria-hidden'?: boolean;
  /**
   * Accessible label of the button.
   */
  'aria-label'?: string;
  /**
   * Size of the button in pixels.
   * @default 40
   */
  buttonSize?: number;
  /**
   * Custom class name for the button.
   */
  className?: string;
  /**
   * Ref of the button element, set by `withForwardedRef`.
   */
  forwardedRef?: React.Ref<HTMLButtonElement>;
  /**
   * Size of the icons in pixels.
   * @default 20
   */
  iconSize?: number;
  /**
   * Called when the checkmark animation has finished.
   */
  onReset?: () => void;
  /**
   * Counts adds that happen outside the click, e.g. in a picker; each increase plays the checkmark.
   * @default 0
   */
  successCount?: number;
}

/**
 * The add to cart button with its checkmark animation.
 */
const AddToCartButton = ({
  'aria-hidden': ariaHidden = false,
  'aria-label': ariaLabel,
  buttonSize = DEFAULT_BUTTON_SIZE,
  className,
  forwardedRef,
  iconSize = DEFAULT_ICON_SIZE,
  isDisabled,
  isLoading,
  onClick,
  onReset,
  successCount = 0,
}: AddToCartButtonProps) => {
  const { classes, cx } = useStyles();
  const theme = useTheme();
  const [showCheckmark, setShowCheckmark] = useState<boolean | null>(null);
  const previousSuccessCount = useRef(successCount);

  const handleCompletion = useCallback(() => {
    setShowCheckmark(true);
    setTimeout(() => {
      setShowCheckmark(false);
    }, 900);
  }, []);

  useEffect(() => {
    if (successCount > previousSuccessCount.current) {
      handleCompletion();
    }
    previousSuccessCount.current = successCount;
  }, [successCount, handleCompletion]);

  const handleClick = useCallback((event: React.MouseEvent<HTMLButtonElement>) => {
    if (showCheckmark || isLoading || isDisabled) {
      return;
    }

    const result = onClick(event);

    if (result === false) {
      return;
    }

    if (result instanceof Promise) {
      (async () => {
        try {
          await result;
          handleCompletion();
        } catch (error) {
          // ignore error in button.
        }
      })();
      return;
    }

    handleCompletion();
  }, [showCheckmark, isLoading, isDisabled, onClick, handleCompletion]);

  const handleCartAnimationEnd = useCallback(() => {
    if (showCheckmark === false) {
      setShowCheckmark(null);
    }
    onReset?.();
  }, [showCheckmark, onReset]);

  let buttonStateClass = classes.buttonReady;
  let tickIconClass = classes.icon;
  let cartPlusIconClass = classes.icon;

  const iconOpacity = isLoading ? { opacity: 0 } : { opacity: 1 };
  const spinnerInlineStyle = isLoading ? { opacity: 1 } : { opacity: 0 };

  let tickInlineStyle: React.CSSProperties | undefined = showCheckmark === null ? {
    transform: 'translate3d(0, 300%, 0)',
    ...iconOpacity,
  } : undefined;

  let cartInlineStyle: React.CSSProperties | undefined = showCheckmark === null ? {
    transform: 'translate3d(0, -50%, 0)',
    ...iconOpacity,
  } : undefined;

  if (isDisabled && !isLoading) {
    buttonStateClass = classes.buttonDisabled;
  } else if (showCheckmark) {
    tickIconClass = cx(classes.icon, classes.springFromBottom);
    cartPlusIconClass = cx(classes.icon, classes.springToTop);
    buttonStateClass = classes.buttonSuccess;
    tickInlineStyle = {
      transform: 'translate3d(0, -50%, 0)',
      ...iconOpacity,
    };
    cartInlineStyle = {
      transform: 'translate3d(0, -300%, 0)',
      ...iconOpacity,
    };
  } else if (showCheckmark !== null) {
    tickIconClass = cx(classes.icon, classes.springToBottom);
    cartPlusIconClass = cx(classes.icon, classes.springFromTop);
    cartInlineStyle = {
      transform: 'translate3d(0, -50%, 0)',
      ...iconOpacity,
    };
    tickInlineStyle = {
      transform: 'translate3d(0, -300%, 0)',
      ...iconOpacity,
    };
  }

  const wrapperStyle = getWrapperStyle(buttonSize, iconSize);

  return (
    <button
      data-test-id="addToCartButton"
      className={cx(
        'ui-shared__add-to-cart-button',
        buttonStateClass,
        className
      )}
      style={wrapperStyle}
      onClick={handleClick}
      aria-hidden={ariaHidden}
      aria-label={ariaLabel}
      aria-disabled={isDisabled}
      ref={forwardedRef}
      type="button"
    >
      {isLoading && (
        <div className={cx(classes.icon, classes.spinnerIcon)} style={spinnerInlineStyle}>
          <IndicatorCircle
            color={theme.contrastColor(theme.components.ctaButton.background)}
            strokeWidth={5}
            paused={!isLoading}
          />
        </div>
      )}
      <div className={tickIconClass} style={tickInlineStyle}>
        <TickIcon />
      </div>
      <div
        className={cartPlusIconClass}
        style={cartInlineStyle}
        onAnimationEnd={handleCartAnimationEnd}
      >
        <CartPlusIcon />
      </div>
    </button>
  );
};

export default withForwardedRef(AddToCartButton) as React.ForwardRefExoticComponent<
  Omit<AddToCartButtonProps, 'forwardedRef'> & React.RefAttributes<HTMLButtonElement>
>;
