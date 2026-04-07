import React, { useCallback, useState } from 'react';
import PropTypes from 'prop-types';
import spring from 'css-spring';
import { themeConfig } from '@shopgate/pwa-common/helpers/config';
import { withForwardedRef } from '@shopgate/engage/core';
import { keyframes, makeStyles } from '@shopgate/engage/styles';
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

const useStyles = makeStyles()({
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
  },
  spinnerIcon: {
    left: '50%',
    top: '50%',
    marginTop: -(themeConfig.variables.loadingIndicator.size) / 2,
    marginLeft: -(themeConfig.variables.loadingIndicator.size) / 2,
  },
  buttonReady: {
    background: `var(--color-button-cta, ${themeConfig.colors.cta})`,
    color: `var(--color-button-cta-contrast, ${themeConfig.colors.ctaContrast})`,
  },
  buttonSuccess: {
    background: `var(--color-button-cta-contrast, ${themeConfig.colors.ctaContrast})`,
    color: `var(--color-button-cta, ${themeConfig.colors.cta})`,
  },
  buttonDisabled: {
    background: themeConfig.colors.shade5,
    color: `var(--color-button-cta-contrast, ${themeConfig.colors.ctaContrast})`,
    boxShadow: themeConfig.shadows.buttons.disabled,
  },
});

/**
 * @param {number} bSize .
 * @param {number} iSize .
 * @returns {Object}
 */
const getWrapperStyle = (bSize, iSize) => ({
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

/**
 * AddToCartButton component.
 * @param {Object} props Props.
 * @returns {JSX.Element}
 */
const AddToCartButton = ({
  'aria-hidden': ariaHidden,
  'aria-label': ariaLabel,
  buttonSize,
  className,
  forwardedRef,
  iconSize,
  isDisabled,
  isLoading,
  onClick,
  onReset,
}) => {
  const { classes, cx } = useStyles();
  const [showCheckmark, setShowCheckmark] = useState(null);

  /**
   * @param {Event} e Click event.
   */
  const handleClick = useCallback((e) => {
    if (showCheckmark || isLoading || isDisabled) {
      return;
    }

    /** Completes the success checkmark animation cycle. */
    const handleCompletion = () => {
      setShowCheckmark(true);
      setTimeout(() => {
        setShowCheckmark(false);
      }, 900);
    };

    const result = onClick(e);

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
  }, [showCheckmark, isLoading, isDisabled, onClick]);

  const handleCartAnimationEnd = useCallback(() => {
    if (showCheckmark === false) {
      setShowCheckmark(null);
    }
    onReset();
  }, [showCheckmark, onReset]);

  let buttonStateClass = classes.buttonReady;
  let tickIconClass = classes.icon;
  let cartPlusIconClass = classes.icon;

  const iconOpacity = isLoading ? { opacity: 0 } : { opacity: 1 };
  const spinnerInlineStyle = isLoading ? { opacity: 1 } : { opacity: 0 };

  let tickInlineStyle = showCheckmark === null ? {
    transform: 'translate3d(0, 300%, 0)',
    ...iconOpacity,
  } : null;

  let cartInlineStyle = showCheckmark === null ? {
    transform: 'translate3d(0, -50%, 0)',
    ...iconOpacity,
  } : null;

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
            color={themeConfig.colors.primaryContrast}
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

AddToCartButton.propTypes = {
  isDisabled: PropTypes.bool.isRequired,
  isLoading: PropTypes.bool.isRequired,
  onClick: PropTypes.func.isRequired,
  'aria-hidden': PropTypes.bool,
  'aria-label': PropTypes.string,
  buttonSize: PropTypes.number,
  className: PropTypes.string,
  forwardedRef: PropTypes.shape(),
  iconSize: PropTypes.number,
  onReset: PropTypes.func,
};

AddToCartButton.defaultProps = {
  'aria-hidden': false,
  'aria-label': null,
  buttonSize: DEFAULT_BUTTON_SIZE,
  className: null,
  forwardedRef: null,
  iconSize: DEFAULT_ICON_SIZE,
  onReset: () => { },
};

export default withForwardedRef(AddToCartButton);
