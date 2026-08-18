import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Button } from '@shopgate/engage/components/v2';
import { makeStyles } from '@shopgate/engage/styles';
import { i18n } from '@shopgate/engage/core/helpers';
import { toggleFavoriteWithListChooser } from '@shopgate/pwa-common-commerce/favorites/actions/toggleFavorites';
import {
  makeIsProductOnFavoriteList,
  hasMultipleFavoritesList,
} from '@shopgate/pwa-common-commerce/favorites/selectors';
import { getWishlistItemQuantityEnabled } from '@shopgate/engage/settings/selectors/shopSettings';
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

const useStyles = makeStyles()(() => ({
  root: {
    margin: '0 0 16px 16px',
    textTransform: 'none',
  },
}));

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
    <Button
      variant="outlined"
      color="primary"
      className={classes.root}
      onClick={() => toggle(productId)}
    >
      { i18n.text(label) }
    </Button>
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
