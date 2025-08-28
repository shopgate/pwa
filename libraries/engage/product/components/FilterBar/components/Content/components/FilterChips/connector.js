import { connect } from 'react-redux';
import { getCurrentPathname } from '@shopgate/engage/core';
import { updateFilters } from '@shopgate/pwa-common-commerce/filter/action-creators';

/**
 * Maps the contents of the state to the component props.
 * @param {Object} state The current application state.
 * @return {Object} The extended component props.
 */
const mapStateToProps = state => ({
  currentPathname: getCurrentPathname(state),
});

/**
 * @param {Function} dispatch The redux dispatch function.
 * @param {Object} props The components props.
 * @return {Object}
 */
const mapDispatchToProps = {
  updateFilters,
};

export default connect(mapStateToProps, mapDispatchToProps);
