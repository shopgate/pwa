import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import connect from './connector';
import styles from './style';

/**
 * @param {Object} props The component props.
 * @returns {JSX}
 */
function SuggestionList(props) {
  const { onClick, suggestions, bottomHeight } = props;

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

SuggestionList.propTypes = {
  bottomHeight: PropTypes.number.isRequired,
  onClick: PropTypes.func.isRequired,
  suggestions: PropTypes.arrayOf(PropTypes.string),
};

SuggestionList.defaultProps = {
  suggestions: [],
};

export default connect(SuggestionList);
