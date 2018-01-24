/**
 * Copyright (c) 2017-present, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import List from 'Components/List';
import SearchSuggestion from './components/SearchSuggestion';
import connect from './connector';
import styles from './style';
import { SEARCH_SUGGESTIONS_MIN_CHARACTERS } from './constants';

/**
 * The search suggestions component.
 */
class SearchSuggestions extends Component {
  static propTypes = {
    fetchSearchSuggestions: PropTypes.func.isRequired,
    isFetching: PropTypes.bool.isRequired, // eslint-disable-line react/no-unused-prop-types
    searchPhrase: PropTypes.string.isRequired,
    setSearchPhrase: PropTypes.func.isRequired,
    submitSearch: PropTypes.func.isRequired,
    suggestions: PropTypes.arrayOf(PropTypes.string).isRequired,
    minCharacters: PropTypes.number,
  };

  static defaultProps = {
    minCharacters: SEARCH_SUGGESTIONS_MIN_CHARACTERS,
  };

  /**
   * Component constructor.
   * @param {Object} props Component props.
   */
  constructor(props) {
    super(props);

    this.state = {
      suggestions: props.suggestions,
    };
  }

  /**
   * Get search suggestions for new search phrase.
   * @param {Object} nextProps The next properties.
   */
  componentWillReceiveProps(nextProps) {
    if (!nextProps.isFetching) {
      this.setState({ suggestions: nextProps.suggestions });
    }

    if (
      nextProps.searchPhrase === this.props.searchPhrase ||
      nextProps.searchPhrase.length < this.props.minCharacters
    ) {
      return;
    }

    this.props.fetchSearchSuggestions();
  }

  /**
   * Handles the selection of a suggestion and updates the search.
   * @param {string} searchPhrase The selected search phrase.
   */
  handleSelect(searchPhrase) {
    this.props.setSearchPhrase(searchPhrase);
    this.props.submitSearch();
    this.props.fetchSearchSuggestions();
  }

  /**
   * Renders the component.
   * @return {JSX}
   */
  render() {
    const { suggestions } = this.state;

    if (
      suggestions.length === 0 ||
      this.props.searchPhrase.length < this.props.minCharacters
    ) {
      return null;
    }

    return (
      <div className={styles.container}>
        <List>
          {suggestions.map(suggestion =>
            <SearchSuggestion
              key={suggestion}
              suggestion={suggestion}
              onClick={() => this.handleSelect(suggestion)}
            />
          )}
        </List>
      </div>
    );
  }
}

export default connect(SearchSuggestions);
