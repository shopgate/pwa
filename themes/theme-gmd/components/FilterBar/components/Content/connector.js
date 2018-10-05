import { connect } from 'react-redux';
import getFilters from '@shopgate/pwa-common-commerce/filter/actions/getFilters';
import { getActiveFilters } from '@shopgate/pwa-common-commerce/filter/selectors';

/**
 * Maps the contents of the state to the component props.
 * @param {Object} state The current application state.
 * @return {Object} The extended component props.
 */
const mapStateToProps = state => ({
  activeFilters: getActiveFilters(state),
});

/**
 * Connects the dispatch function to a callable function in the props.
 * @param {Function} dispatch The redux dispatch function.
 * @return {Object} The extended component props.
 */
const mapDispatchToProps = dispatch => ({
  getFilters: () => dispatch(getFilters()),
});

export default connect(mapStateToProps, mapDispatchToProps);
