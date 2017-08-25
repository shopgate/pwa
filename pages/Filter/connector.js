/**
 * Copyright (c) 2017, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { connect } from 'react-redux';
import {
  getAvailableFilters,
  getActiveFilters,
  hasActiveFilters,
  haveFiltersChanged,
  getCurrentFilterAttribute,
  getCurrentActiveValues,
} from 'Library/selectors/filters';
import {
  setActiveFilters,
  mergeTemporaryFilters,
  removeTemporaryFilter,
} from 'Library/action-creators/filters';
import {
  getFilters,
  commitTemporaryFilters,
  openFilterView,
  removeAllTemporaryFilters,
  applyFilters,
} from 'Library/actions/filters';
import {
  setFilterOpened,
  setFilterClosed,
  setFilterAttributeOpened,
  setFilterAttributeClosed,
} from 'Library/action-creators/navigator';
import { goBackHistory } from 'Library/actions/history';
import { getQueryParamsAsString } from 'Library/selectors/history';

/**
 * Maps the contents of the state to the component props.
 * @param {Object} state The current application state.
 * @param {Object} props The component props.
 * @return {Object} The extended component props.
 */
const mapStateToProps = (state, props) => ({
  availableFilters: getAvailableFilters(state, props),
  activeFilters: getActiveFilters(state),
  temporaryFilters: state.filters.temporaryFilters,
  filtersChanged: haveFiltersChanged(state),
  hasActiveFilters: hasActiveFilters(state),
  currentAttribute: getCurrentFilterAttribute(state),
  currentActiveValues: getCurrentActiveValues(state) || [],
  queryParams: getQueryParamsAsString(state),
});

/**
 * Connects the dispatch function to a callable function in the props.
 * @param  {Function} dispatch The redux dispatch function.
 * @param  {Object} props The components props.
 * @return {Object} The extended component props.
 */
const mapDispatchToProps = (dispatch, props) => ({
  applyFilters: () => dispatch(applyFilters()),
  commitTemporaryFilters: () => dispatch(commitTemporaryFilters()),
  handleOpenFilters: () => dispatch(openFilterView(props)),
  getFilters: () => dispatch(getFilters()),
  goBackHistory: (amount = 1) => dispatch(goBackHistory(amount)),
  mergeTemporaryFilters: temporaryFilters => dispatch(mergeTemporaryFilters(temporaryFilters)),
  setActiveFilters: activeFilters => dispatch(setActiveFilters(activeFilters)),
  setFilterClosed: () => dispatch(setFilterClosed()),
  setFilterOpened: () => dispatch(setFilterOpened()),
  setFilterAttributeClosed: () => dispatch(setFilterAttributeClosed()),
  setFilterAttributeOpened: () => dispatch(setFilterAttributeOpened()),
  removeTemporaryFilter: (id, index = null) => dispatch(removeTemporaryFilter(id, index)),
  removeAllTemporaryFilters: () => dispatch(removeAllTemporaryFilters()),
});

export default connect(mapStateToProps, mapDispatchToProps, null, { withRef: true });
