import React, { Component } from 'react';
import PropTypes from 'prop-types';
import connect from './connector';
import styles from './style';

/**
 * The SuggestionList component.
 */
class SuggestionList extends Component {
  static propTypes = {
    onClick: PropTypes.func.isRequired,
    fetching: PropTypes.bool,
    suggestions: PropTypes.arrayOf(PropTypes.string),
  };

  static defaultProps = {
    fetching: false,
    suggestions: [],
  };
  /**
   * @param { Object } nextProps Next props.
   * @return {boolean}
   */
  shouldComponentUpdate(nextProps) {
    return nextProps.fetching === false && nextProps.suggestions;
  }

  /**
   * @return {JSX}
   */
  render() {
    const { onClick, suggestions } = this.props;

    if (!suggestions) {
      return null;
    }

    return (
      <div className={styles.list}>
        {suggestions.map(suggestion => (
          <button
            className={styles.item}
            onClick={onClick}
            key={suggestion}
            value={suggestion}
            data-test-id={`searchSuggestion ${suggestion}`}
          >
            {suggestion}
          </button>
        ))}
      </div>
    );
  }
}

export { SuggestionList as UnwrappedSuggestionList };

export default connect(SuggestionList);
