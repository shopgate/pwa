import { connect } from 'react-redux';
import { getHistoryPathname } from '@shopgate/pwa-common/selectors/history';
import removeTemporaryFilter from '@shopgate/pwa-common-commerce/filter/action-creators/removeTemporaryFilter';
import commitTemporaryFilters from '@shopgate/pwa-common-commerce/filter/actions/commitTemporaryFilters';
import { getActiveFilters } from '@shopgate/pwa-common-commerce/filter/selectors';
import openFilterRoute from '../../actions/openFilterRoute';

/**
 * Maps the contents of the state to the component props.
 * @param {Object} state The current application state.
 * @return {Object} The extended component props.
 */
const mapStateToProps = state => ({
  activeFilters: getActiveFilters(state),
  currentPathname: getHistoryPathname(state),
});

/**
 * Connects the dispatch function to a callable function in the props.
 * @param {Function} dispatch The redux dispatch function.
 * @return {Object} The extended component props.
 */
const mapDispatchToProps = dispatch => ({
  handleFilterRemove: (id, index) => {
    dispatch(removeTemporaryFilter(id, index));
    setTimeout(() => {
      dispatch(commitTemporaryFilters());
    }, 0);
  },
  handleOpenFilters: () => dispatch(openFilterRoute()),
});

export default connect(mapStateToProps, mapDispatchToProps);
