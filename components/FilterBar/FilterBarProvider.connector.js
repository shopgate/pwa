import { connect } from 'react-redux';
import { getCurrentRoute } from '@shopgate/pwa-common/selectors/router';
import { updateFilters } from '@shopgate/pwa-common-commerce/filter/action-creators';
import openFilterRoute from './components/Content/actions/openFilterRoute';

/**
 * @param {Object} state App state.
 * @returns {Object}
 */
const mapStateToProps = (state) => {
  const { state: routeState } = getCurrentRoute(state);

  return {
    routeFilterState: routeState.filters || {},
  };
};
/**
 * @return {Object}
 */
const mapDispatchToProps = {
  navigate: () => openFilterRoute(),
  updateFilters,
};

export default connect(mapStateToProps, mapDispatchToProps);
