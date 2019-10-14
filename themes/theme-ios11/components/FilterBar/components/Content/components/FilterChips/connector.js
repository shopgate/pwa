import { connect } from 'react-redux';
import { getHistoryPathname } from '@shopgate/engage/core';
import { updateFilters } from '@shopgate/pwa-common-commerce/filter/action-creators';
import openFilterRoute from '../../actions/openFilterRoute';

/**
 * Maps the contents of the state to the component props.
 * @param {Object} state The current application state.
 * @return {Object} The extended component props.
 */
const mapStateToProps = state => ({
  currentPathname: getHistoryPathname(state),
});

const mapDispatchToProps = {
  openFilters: () => openFilterRoute(),
  updateFilters: filters => updateFilters(filters),
};

export default connect(mapStateToProps, mapDispatchToProps);
