import React, { Component } from 'react';
import PropTypes from 'prop-types';
import connect from './connector';
import inject from './injector';
import styles from './style';

/**
 * The SuggestionList component.
 */
class SuggestionList extends Component {
  static propTypes = {
    navigate: PropTypes.func.isRequired,
    toggleSearchField: PropTypes.func.isRequired,
    suggestions: PropTypes.arrayOf(PropTypes.string),
  };

  static defaultProps = {
    suggestions: [],
  };

  /**
   * @param {MouseEvent} event The event of the click.
   */
  handleClick = (event) => {
    event.preventDefault();
    this.props.toggleSearchField(false);
    this.props.navigate(`/search?s=${event.target.value}`);
  }

  /**
   * @return {JSX}
   */
  render() {
    const { suggestions } = this.props;

    if (!suggestions) {
      return null;
    }

    return (
      <div className={styles.list}>
        {suggestions.map(suggestion => (
          <button
            className={styles.item}
            onClick={this.handleClick}
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

export default inject(connect(SuggestionList));
