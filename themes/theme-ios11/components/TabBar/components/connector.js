import { connect } from 'react-redux';
import { getShowWishlistItemsCountBadge } from '@shopgate/engage/core';
import { navigate } from './actions';

/**
 * Maps the contents of the state to the component props.
 * @param {Object} state The current application state.
 * @return {Object} The extended component props.
 */
const mapStateToProps = state => ({
  showWishlistItemsCountBadge: getShowWishlistItemsCountBadge(state),
});

/**
 * @return {Object} The extended component props.
 */
const mapDispatchToProps = {
  historyPush: navigate,
};

export default connect(mapStateToProps, mapDispatchToProps);

