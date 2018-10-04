import { connect } from 'react-redux';
import { getHistoryPathname } from '@shopgate/pwa-common/selectors/history';
import removeTemporaryFilter from '@shopgate/pwa-common-commerce/filter/action-creators/removeTemporaryFilter';
import commitTemporaryFilters from '@shopgate/pwa-common-commerce/filter/actions/commitTemporaryFilters';
import { getActiveFilters } from '@shopgate/pwa-common-commerce/filter/selectors';
import openFilterView from '../../actions/openFilterView';

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
const mapDispatchToProps = (dispatch) => ({
  handleFilterRemove: (id, index = null) => {
    dispatch(removeTemporaryFilter(id, index));
    dispatch(commitTemporaryFilters());
  },
  handleOpenFilters: () => dispatch(openFilterView()),
});

export default connect(mapStateToProps, mapDispatchToProps);
