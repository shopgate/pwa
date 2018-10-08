import React, { Component } from 'react';
import PropTypes from 'prop-types';
import List from '@shopgate/pwa-common/components/List';
import { SEARCH_SUGGESTIONS_MIN_CHARACTERS } from './constants';
import SearchSuggestion from './components/Suggestion';
import connect from './connector';
import styles from './style';

/**
 * The search suggestions component.
 */
class SearchSuggestions extends Component {
  static propTypes = {
    bottomHeight: PropTypes.number.isRequired,
    fetchSearchSuggestions: PropTypes.func.isRequired,
    isFetching: PropTypes.bool.isRequired,
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
   * Component did mount.
   */
  componentDidMount() {
    this.props.fetchSearchSuggestions();
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

    if (suggestions.length === 0 || this.props.searchPhrase.length < this.props.minCharacters) {
      return null;
    }

    return (
      <div className={[styles.wrapper, styles.bottom(this.props.bottomHeight)].join(' ')}>
        <List>
          {suggestions.map(suggestion => (
            <SearchSuggestion
              key={suggestion}
              suggestion={suggestion}
              onClick={() => this.handleSelect(suggestion)}
            />))}
        </List>
      </div>
    );
  }
}

export default connect(SearchSuggestions);
