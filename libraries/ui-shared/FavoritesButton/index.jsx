import React, {
  useCallback, useRef, useMemo, memo,
} from 'react';
import PropTypes from 'prop-types';
import appConfig, { themeShadows, themeColors } from '@shopgate/pwa-common/helpers/config';
import { i18n } from '@shopgate/engage/core/helpers';
import { makeStyles } from '@shopgate/engage/styles';
import HeartIcon from '../icons/HeartIcon';
import HeartOutlineIcon from '../icons/HeartOutlineIcon';
import HeartPlusOutlineIcon from '../icons/HeartPlusOutlineIcon';
import HeartPlus from '../icons/HeartPlusIcon';
import Ripple from '../Ripple';
import connect from './connector';

const buttonProto = {
  display: 'block',
  position: 'relative',
  background: themeColors.light,
  borderRadius: '50%',
  padding: 0,
  fontSize: 20,
  lineHeight: 1,
  color: 'var(--color-secondary)',
  outline: 0,
};

const useStyles = makeStyles()({
  buttonFlat: {
    ...buttonProto,
  },
  button: {
    ...buttonProto,
    boxShadow: themeShadows.buttons.elevated,
  },
  ripple: {
    padding: 6,
  },
});

/**
 * The favorites button component.
 * @param {Object} props Props.
 * @returns {JSX.Element|null}
 */
const FavoritesButton = ({
  active,
  addFavorites,
  'aria-hidden': ariaHidden,
  className,
  loadWishlistOnAppStartEnabled,
  noShadow,
  once,
  onRippleComplete,
  productId,
  removeFavorites,
  removeThrottle,
  removeWithRelatives,
  rippleClassName,
  wishlistItemQuantityEnabled,
}) => {
  const { classes, cx } = useStyles();
  const clickedOnceRef = useRef(false);

  const handleRippleComplete = useCallback(() => {
    onRippleComplete(active);
  }, [onRippleComplete, active]);

  const handleClick = useCallback((event) => {
    event.preventDefault();
    event.stopPropagation();

    if (once && clickedOnceRef.current) {
      return;
    }

    clickedOnceRef.current = true;

    if (!productId) {
      return;
    }

    if (!active || wishlistItemQuantityEnabled) {
      addFavorites(productId);
    } else {
      setTimeout(() => {
        removeFavorites(productId, removeWithRelatives);
      }, removeThrottle);
    }
  }, [
    once,
    productId,
    active,
    wishlistItemQuantityEnabled,
    addFavorites,
    removeFavorites,
    removeWithRelatives,
    removeThrottle,
  ]);

  const icon = useMemo(() => {
    if (
      !loadWishlistOnAppStartEnabled ||
      (wishlistItemQuantityEnabled && !active)
    ) {
      return <HeartPlusOutlineIcon />;
    }

    if (wishlistItemQuantityEnabled && active) {
      return <HeartPlus />;
    }

    if (active) {
      return <HeartIcon />;
    }

    return <HeartOutlineIcon />;
  }, [loadWishlistOnAppStartEnabled, wishlistItemQuantityEnabled, active]);

  if (!appConfig.hasFavorites) {
    return null;
  }

  const buttonClass = noShadow ? classes.buttonFlat : classes.button;
  const ariaLabel = i18n.text(active ? 'favorites.remove' : 'favorites.add');

  return (
    <button
      aria-label={ariaLabel}
      aria-hidden={ariaHidden}
      className={cx('ui-shared__favorites-button', buttonClass, className)}
      onClick={handleClick}
      data-test-id="favoriteButton"
      type="button"
    >
      <Ripple
        className={cx(classes.ripple, rippleClassName)}
        onComplete={handleRippleComplete}
      >
        {icon}
      </Ripple>
    </button>
  );
};

FavoritesButton.propTypes = {
  active: PropTypes.bool,
  addFavorites: PropTypes.func,
  'aria-hidden': PropTypes.bool,
  className: PropTypes.string,
  loadWishlistOnAppStartEnabled: PropTypes.bool,
  noShadow: PropTypes.bool,
  // When true, button would react on click only once.
  once: PropTypes.bool,
  onRippleComplete: PropTypes.func,
  productId: PropTypes.string,
  removeFavorites: PropTypes.func,
  removeThrottle: PropTypes.number,
  removeWithRelatives: PropTypes.bool,
  rippleClassName: PropTypes.string,
  wishlistItemQuantityEnabled: PropTypes.bool,
};

FavoritesButton.defaultProps = {
  active: false,
  addFavorites: () => {},
  'aria-hidden': null,
  className: '',
  noShadow: false,
  once: false,
  onRippleComplete: () => {},
  productId: null,
  removeFavorites: () => {},
  removeThrottle: 0,
  removeWithRelatives: false,
  rippleClassName: '',
  wishlistItemQuantityEnabled: false,
  loadWishlistOnAppStartEnabled: true,
};

export default connect(memo(FavoritesButton));
