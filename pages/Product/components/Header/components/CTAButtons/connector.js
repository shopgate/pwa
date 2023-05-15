import { connect } from 'react-redux';
import { isCurrentProductOnFavoriteList } from '@shopgate/engage/favorites';
import { makeIsProductActive, makeIsBaseProductActive } from '@shopgate/engage/product';
import { getLoadWishlistOnAppStartEnabled } from '@shopgate/engage/core';

/**
 * Maps the contents of the state to the component props.
 * @param {Object} state The current application state.
 * @param {Object} props The component props.
 * @return {Object} The extended component props.
 */
const makeMapStateToProps = () => {
  const isProductActive = makeIsProductActive();
  const isBaseProductActive = makeIsBaseProductActive();

  return (state, props) => {
    const isActive = isProductActive(state, props) && isBaseProductActive(state, props);
    const loadWishlistOnAppStartEnabled = getLoadWishlistOnAppStartEnabled(state);
    const isOnWishlist = isCurrentProductOnFavoriteList(state, props);

    return ({
      isFavorite: !loadWishlistOnAppStartEnabled ? false : isOnWishlist,
      isProductActive: isActive,
    });
  };
};

export default connect(makeMapStateToProps);
