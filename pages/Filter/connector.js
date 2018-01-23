/**
 * Copyright (c) 2017-present, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import connect from '@shopgate/pwa-common/components/Router/helpers/connect';
import { getAvailableFilters } from '@shopgate/pwa-common-commerce/filter/selectors';
import mergeTemporaryFilters from '@shopgate/pwa-common-commerce/filter/action-creators/mergeTemporaryFilters';
import removeTemporaryFilter from '@shopgate/pwa-common-commerce/filter/action-creators/removeTemporaryFilter';
import { getQueryParamsAsString } from '@shopgate/pwa-common/selectors/history';

/**
 * Maps the contents of the state to the component props.
 * @param {Object} state The current application state.
 * @param {Object} props The component props.
 * @return {Object} The extended component props.
 */
const mapStateToProps = (state, props) => ({
  availableFilters: getAvailableFilters(state, props),
  temporaryFilters: state.filter.temporaryFilters,
  queryParams: getQueryParamsAsString(state),
});

/**
 * Connects the dispatch function to a callable function in the props.
 * @param {Function} dispatch The redux dispatch function.
 * @return {Object} The extended component props.
 */
const mapDispatchToProps = dispatch => ({
  mergeTemporaryFilters: temporaryFilters => dispatch(mergeTemporaryFilters(temporaryFilters)),
  removeTemporaryFilter: (id, index = null) => dispatch(removeTemporaryFilter(id, index)),
});

export default connect(mapStateToProps, mapDispatchToProps, null, { withRef: true });
