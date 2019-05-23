import { connect } from 'react-redux';
import {
  getFavorites,
  isInitialLoading,
} from '@shopgate/engage/favorites';

/**
 * Maps state to props.
 * @param {Object} state State.
 * @returns {Object}
 */
const mapStateToProps = state => ({
  products: getFavorites(state),
  initialLoading: isInitialLoading(state),
});

/**
 * @param {Object} next The next component props.
 * @param {Object} prev The previous component props.
 * @return {boolean}
 */
const areStatePropsEqual = (next, prev) => {
  if (prev.products.length !== next.products.length) {
    return false;
  }

  if (prev.initialLoading !== next.initialLoading) {
    return false;
  }

  return true;
};

export default connect(mapStateToProps, null, null, { areStatePropsEqual });
