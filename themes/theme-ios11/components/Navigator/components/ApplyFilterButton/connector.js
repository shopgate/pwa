import { connect } from 'react-redux';
import { haveFiltersChanged } from '@shopgate/pwa-common-commerce/filter/selectors';
import applyFilters from '@shopgate/pwa-common-commerce/filter/actions/applyFilters';

/**
 * Maps the contents of the state to the component props.
 * @param {Object} state The current application state.
 * @return {Object} The extended component props.
 */
const mapStateToProps = state => ({
  filtersChanged: haveFiltersChanged(state),
});

/**
 * Connects the dispatch function to a callable function in the props.
 * @param {Function} dispatch The redux dispatch function.
 * @return {Object} The extended component props.
 */
const mapDispatchToProps = dispatch => ({
  applyFilters: () => dispatch(applyFilters()),
});

export default connect(mapStateToProps, mapDispatchToProps, null, { withRef: true });
