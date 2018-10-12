import React from 'react';
import PropTypes from 'prop-types';
import connect from './connector';
import styles from './style';

/**
 * @param {Object} props The component props.
 * @returns {JSX}
 */
function SuggestionList(props) {
  const { onClick, suggestions } = props;

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

SuggestionList.propTypes = {
  onClick: PropTypes.func.isRequired,
  suggestions: PropTypes.arrayOf(PropTypes.string),
};

SuggestionList.defaultProps = {
  suggestions: [],
};

export default connect(SuggestionList);
