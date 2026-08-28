import React, {
  useCallback, useRef, useMemo, memo,
} from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import appConfig from '@shopgate/pwa-common/helpers/config';
import { i18n } from '@shopgate/engage/core/helpers';
import { IconButton } from '@shopgate/engage/components/v2';
import HeartIcon from '../icons/HeartIcon';
import HeartOutlineIcon from '../icons/HeartOutlineIcon';
import HeartPlusOutlineIcon from '../icons/HeartPlusOutlineIcon';
import HeartPlus from '../icons/HeartPlusIcon';
import connect from './connector';

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
  once,
  productId,
  removeFavorites,
  removeThrottle,
  removeWithRelatives,
  size,
  wishlistItemQuantityEnabled,
}) => {
  const clickedOnceRef = useRef(false);

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

  return (
    <IconButton
      aria-label={i18n.text(active ? 'favorites.remove' : 'favorites.add')}
      aria-hidden={ariaHidden}
      variant="surface"
      color="secondary"
      size={size}
      className={classNames('ui-shared__favorites-button', className)}
      onClick={handleClick}
      testId="favoriteButton"
    >
      {icon}
    </IconButton>
  );
};

FavoritesButton.propTypes = {
  active: PropTypes.bool,
  addFavorites: PropTypes.func,
  'aria-hidden': PropTypes.bool,
  className: PropTypes.string,
  loadWishlistOnAppStartEnabled: PropTypes.bool,
  // When true, button would react on click only once.
  once: PropTypes.bool,
  productId: PropTypes.string,
  removeFavorites: PropTypes.func,
  removeThrottle: PropTypes.number,
  removeWithRelatives: PropTypes.bool,
  size: PropTypes.oneOf(['small', 'medium', 'large']),
  wishlistItemQuantityEnabled: PropTypes.bool,
};

FavoritesButton.defaultProps = {
  active: false,
  addFavorites: () => { },
  'aria-hidden': null,
  className: '',
  once: false,
  productId: null,
  removeFavorites: () => { },
  removeThrottle: 0,
  removeWithRelatives: false,
  size: 'small',
  wishlistItemQuantityEnabled: false,
  loadWishlistOnAppStartEnabled: true,
};

export default connect(memo(FavoritesButton));
