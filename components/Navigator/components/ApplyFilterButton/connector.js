import { connect } from 'react-redux';
import { haveFiltersChanged } from '@shopgate/pwa-common-commerce/filter/selectors';
import applyFilters from '@shopgate/pwa-common-commerce/filter/actions/applyFilters';

/**
 * @param {Object} state The current application state.
 * @return {Object}
 */
const mapStateToProps = state => ({
  filtersChanged: haveFiltersChanged(state),
});

/**
 * @param {Function} dispatch The redux dispatch function.
 * @return {Object}
 */
const mapDispatchToProps = dispatch => ({
  applyFilters: () => dispatch(applyFilters()),
});

export default connect(mapStateToProps, mapDispatchToProps);
