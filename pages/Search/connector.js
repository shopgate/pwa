/**
 * Copyright (c) 2017, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { connect } from 'react-redux';
import { getSearchPhrase } from '@shopgate/pwa-common-commerce/search/selectors';
import { getProductsResult } from '@shopgate/pwa-common-commerce/product/selectors/product';
import { getSearchResults } from '@shopgate/pwa-common-commerce/search/actions';
import { setActiveFilters } from '@shopgate/pwa-common-commerce/filter/action-creators';

/**
 * Maps the contents of the state to the component props.
 * @param {Object} state The current application state.
 * @param {Object} props The component props.
 * @return {Object} The extended component props.
 */
const mapStateToProps = state => ({
  hasProducts: getProductsResult(state).products.length > 0,
  searchPhrase: getSearchPhrase(state),
});

/**
 * Connects the dispatch function to a callable function in the props.
 * @param  {Function} dispatch The redux dispatch function.
 * @return {Object} The extended component props.
 */
const mapDispatchToProps = dispatch => ({
  getSearchResults(offset) {
    dispatch(getSearchResults(offset));
  },
  setActiveFilters(filters) {
    dispatch(setActiveFilters(filters));
  },
});

export default connect(mapStateToProps, mapDispatchToProps, null, { withRef: true });
