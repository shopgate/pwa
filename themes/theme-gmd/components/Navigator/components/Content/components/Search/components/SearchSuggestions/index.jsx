import React, { Component } from 'react';
import PropTypes from 'prop-types';
import List from 'Components/List';
import SearchSuggestion from './components/SearchSuggestion';
import connect from './connector';
import styles from './style';

/**
 * The SearchSuggestions component.
 */
class SearchSuggestions extends Component {
  static propTypes = {
    fetchSearchSuggestions: PropTypes.func.isRequired,
    isFetching: PropTypes.bool.isRequired,
    phrase: PropTypes.string.isRequired,
    searchPhrase: PropTypes.string.isRequired,
    setSearchPhrase: PropTypes.func.isRequired,
    submitSearch: PropTypes.func.isRequired,
    suggestions: PropTypes.arrayOf(PropTypes.string).isRequired,
    minCharacters: PropTypes.number,
  };

  static defaultProps = {
    minCharacters: 2,
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
   * Only re-render when a new input value is received or
   * when a new set of suggestions arrive.
   * @param {*} nextProps The next component props.
   * @param {*} nextState The next component state.
   * @returns {boolean}
   */
  shouldComponentUpdate(nextProps, nextState) {
    return (
      this.props.phrase !== nextProps.phrase
      || this.state.suggestions.length !== nextState.length
    );
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
      this.props.phrase.length === 0 ||
      this.props.searchPhrase.length < this.props.minCharacters
    ) {
      return null;
    }

    return (
      <div className={styles.container}>
        <List>
          {suggestions.map(suggestion =>
            (<SearchSuggestion
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
