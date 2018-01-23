/**
 * Copyright (c) 2017-present, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { connect } from 'react-redux';
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
});

/**
 * Connects the dispatch function to a callable function in the props.
 * @param {Function} dispatch The redux dispatch function.
 * @param {Object} props The components props.
 * @return {Object} The extended component props.
 */
const mapDispatchToProps = (dispatch, props) => ({
  handleFilterRemove: (id, index = null) => {
    dispatch(removeTemporaryFilter(id, index));
    dispatch(commitTemporaryFilters());
  },
  handleOpenFilters: () => dispatch(openFilterView(props)),
});

export default connect(mapStateToProps, mapDispatchToProps);
