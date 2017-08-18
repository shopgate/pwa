/**
 * Copyright (c) 2017, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { connect } from 'react-redux';
import { fetchSearchSuggestions } from 'Library/actions/search';
import {
  getCurrentSearchSuggestions,
  getSearchPhrase,
  isFetchingCurrentSearchSuggestions,
} from 'Library/selectors/search';
import { submitSearch } from '../../../../../../actions';
import { setSearchPhrase } from '../../../../../../action-creators';

/**
 * Map state to props.
 * @param {Object} state The application state.
 * @return {Object} Enriched component props.
 */
const mapStateToProps = state => ({
  searchPhrase: getSearchPhrase(state),
  suggestions: getCurrentSearchSuggestions(state),
  isFetching: isFetchingCurrentSearchSuggestions(state),
});

/**
 * Connects the dispatch function to a callable function in the props.
 * @param  {Function} dispatch The redux dispatch function.
 * @return {Object} The extended component props.
 */
const mapDispatchToProps = dispatch => ({
  fetchSearchSuggestions: () => dispatch(fetchSearchSuggestions()),
  setSearchPhrase: searchPhrase => dispatch(setSearchPhrase(searchPhrase)),
  submitSearch: () => dispatch(submitSearch()),
});

export default connect(mapStateToProps, mapDispatchToProps);
