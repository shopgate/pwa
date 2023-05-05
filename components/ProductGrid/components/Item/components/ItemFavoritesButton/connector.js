import { connect } from 'react-redux';
import {
  isRelativeProductOnList,
} from '@shopgate/pwa-common-commerce/favorites/selectors';
import { getLoadWishlistOnAppStartEnabled } from '@shopgate/engage/core/selectors/merchantSettings';

/**
 * @param {Object} state The current application state.
 * @param {Object} props The component props.
 * @return {Object} The extended component props.
 */
const mapStateToProps = (state, props) => {
  const loadWishlistOnAppStartEnabled = getLoadWishlistOnAppStartEnabled(state);
  const isOnWishlist = isRelativeProductOnList(state, props);

  return ({
    isFavorite: !loadWishlistOnAppStartEnabled ? false : isOnWishlist,
  });
};

/**
 * @param {Object} next The next component props.
 * @param {Object} prev The previous component props.
 * @returns {boolean}
 */
const areStatePropsEqual = (next, prev) => {
  if (prev.isFavorite !== next.isFavorite) {
    return false;
  }

  return true;
};

export default connect(mapStateToProps, null, null, { areStatePropsEqual });
