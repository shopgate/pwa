import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import connect from './connector';
import styles from './style';

/**
 * The SuggestionList component.
 */
class SuggestionList extends Component {
  static propTypes = {
    bottomHeight: PropTypes.number.isRequired,
    onClick: PropTypes.func.isRequired,
    fetching: PropTypes.bool,
    suggestions: PropTypes.arrayOf(PropTypes.string),
  }

  static defaultProps = {
    suggestions: [],
    fetching: false,
  }

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
    const { onClick, suggestions, bottomHeight } = this.props;

    if (!suggestions) {
      return null;
    }

    return (
      <div className={classnames(styles.list, styles.bottom(bottomHeight))}>
        {suggestions.map(suggestion => (
          <button
            className={styles.item}
            onClick={e => onClick(e, suggestion)}
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
