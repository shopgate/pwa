import React, {
  useCallback, useRef, useMemo, memo,
} from 'react';
import classNames from 'classnames';
import appConfig from '@shopgate/pwa-common/helpers/config';
import { i18n } from '@shopgate/engage/core/helpers';
import { IconButton } from '@shopgate/engage/components/v2';
import type { IconButtonSize } from '@shopgate/engage/components/v2';
import HeartIcon from '../icons/HeartIcon';
import HeartOutlineIcon from '../icons/HeartOutlineIcon';
import HeartPlusOutlineIcon from '../icons/HeartPlusOutlineIcon';
import HeartPlus from '../icons/HeartPlusIcon';
import connect from './connector';

/**
 * Renders the button. Exported through `FavoritesButtonComponent`, which carries the public docs.
 */
const FavoritesButton = ({
  active = false,
  addFavorites,
  'aria-hidden': ariaHidden,
  className = '',
  loadWishlistOnAppStartEnabled = true,
  once = false,
  productId = null,
  removeFavorites,
  removeThrottle = 0,
  removeWithRelatives = false,
  size = 'small',
  wishlistItemQuantityEnabled = false,
}: FavoritesButtonProps) => {
  const clickedOnceRef = useRef(false);

  const handleClick = useCallback((event: React.MouseEvent<HTMLButtonElement>) => {
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
      addFavorites?.(productId);
    } else {
      setTimeout(() => {
        removeFavorites?.(productId, removeWithRelatives);
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

  if (!(appConfig as { hasFavorites: boolean }).hasFavorites) {
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

export interface FavoritesButtonOwnProps {
  /**
   * Whether the product is on a favorites list.
   * @default false
   */
  active?: boolean;
  /**
   * Hides the button from assistive technology, for a surface that exposes the action elsewhere.
   */
  'aria-hidden'?: boolean;
  /**
   * Custom class name for the button.
   */
  className?: string;
  /**
   * If `true`, the button reacts to the first click only.
   * @default false
   */
  once?: boolean;
  /**
   * The product the button toggles.
   */
  productId?: string | null;
  /**
   * Milliseconds to wait before a product is removed again.
   * @default 0
   */
  removeThrottle?: number;
  /**
   * Whether removing the product also removes the favorites of its variants.
   * @default false
   */
  removeWithRelatives?: boolean;
  /**
   * The size of the button.
   * @default 'small'
   */
  size?: IconButtonSize;
}

/**
 * The props the connector provides. Optional, so that the defaults apply to a button that is
 * rendered without it.
 */
interface FavoritesButtonConnectedProps {
  addFavorites?: (productId: string) => void;
  removeFavorites?: (productId: string, removeWithRelatives?: boolean) => void;
  loadWishlistOnAppStartEnabled?: boolean;
  wishlistItemQuantityEnabled?: boolean;
}

export type FavoritesButtonProps = FavoritesButtonOwnProps & FavoritesButtonConnectedProps;

/**
 * The favorites button toggles whether a product is on a favorites list, and shows which of the
 * two states it is in. It renders nothing at all in a shop without the favorites feature.
 */
const FavoritesButtonComponent = connect(memo(FavoritesButton));

export default FavoritesButtonComponent;
