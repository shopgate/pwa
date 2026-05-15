import { connect } from 'react-redux';
import { isCurrentProductOnFavoriteList } from '@shopgate/engage/favorites';
import { makeIsProductActive, getProductImages } from '@shopgate/engage/product';
import { getLoadWishlistOnAppStartEnabled } from '@shopgate/engage/core';

/**
 * Maps the contents of the state to the component props.
 * @param {Object} state The current application state.
 * @param {Object} props The component props.
 * @return {Object} The extended component props.
 */
const makeMapStateToProps = () => {
  const isProductActive = makeIsProductActive(true);

  return (state, props) => {
    const productImages = getProductImages(state, props);
    const isActive = isProductActive(state, props) !== false;
    const loadWishlistOnAppStartEnabled = getLoadWishlistOnAppStartEnabled(state);
    const isOnWishlist = isCurrentProductOnFavoriteList(state, props);

    return ({
      isFavorite: !loadWishlistOnAppStartEnabled ? false : isOnWishlist,
      isProductActive: isActive,
      hasImageGallery: Array.isArray(productImages) && productImages.length > 1,
    });
  };
};

export default connect(makeMapStateToProps);
