import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { RippleButton } from '@shopgate/engage/components';
import { makeStyles } from '@shopgate/engage/styles';
import { i18n } from '@shopgate/engage/core/helpers';
import { toggleFavoriteWithListChooser } from '@shopgate/pwa-common-commerce/favorites/actions/toggleFavorites';
import {
  makeIsProductOnFavoriteList,
  hasMultipleFavoritesList,
} from '@shopgate/pwa-common-commerce/favorites/selectors';
import { getWishlistItemQuantityEnabled } from '@shopgate/engage/core/selectors/shopSettings';
import appConfig from '@shopgate/pwa-common/helpers/config';

/**
 * @returns {Object}
 */
const makeMapStateToProps = () => {
  const getIsOnList = makeIsProductOnFavoriteList((_, props) => props.productId);
  return (state, props) => ({
    isOnList: getIsOnList(state, props),
    hasMultipleLists: hasMultipleFavoritesList(state),
    wishlistItemQuantityEnabled: getWishlistItemQuantityEnabled(state),
  });
};

/**
 * @param {Function} dispatch Dispatch
 * @returns {Object}
 * */
const mapDispatchToProps = dispatch => ({
  toggle: productId => dispatch(toggleFavoriteWithListChooser(productId)),
});

const useStyles = makeStyles()({
  root: {
    '&&': {
      margin: '0 0px 16px 16px',
      backgroundColor: '#fff',
      border: '1px solid var(--color-primary)',
      color: 'var(--color-high-emphasis)',
      borderRadius: 5,
      fontSize: 14,
      textTransform: 'none',
      padding: 0,
    },
  },
  ripple: {
    padding: '8px 16px',
  },
});

/** @returns {JSX} */
const FavoriteButtonWide = ({
  productId,
  toggle,
  isOnList,
  hasMultipleLists,
  wishlistItemQuantityEnabled,
}) => {
  const { classes } = useStyles();
  const label = useMemo(() => {
    // When wishlist item quantity is active, items cannot be removed via the button
    if (!isOnList || wishlistItemQuantityEnabled) {
      return 'favorites.add_to_list';
    } if (hasMultipleLists) {
      return 'favorites.edit_lists';
    }

    return 'favorites.remove_from_list';
  }, [hasMultipleLists, isOnList, wishlistItemQuantityEnabled]);

  if (!appConfig.hasFavorites) {
    return null;
  }

  return (
    <RippleButton
      className={classes.root}
      rippleClassName={classes.ripple}
      type="primary"
      onClick={() => toggle(productId)}
    >
      { i18n.text(label) }
    </RippleButton>
  );
};

FavoriteButtonWide.propTypes = {
  hasMultipleLists: PropTypes.bool.isRequired,
  isOnList: PropTypes.bool.isRequired,
  productId: PropTypes.string.isRequired,
  toggle: PropTypes.func.isRequired,
  wishlistItemQuantityEnabled: PropTypes.bool.isRequired,
};

export default connect(makeMapStateToProps, mapDispatchToProps)(FavoriteButtonWide);
