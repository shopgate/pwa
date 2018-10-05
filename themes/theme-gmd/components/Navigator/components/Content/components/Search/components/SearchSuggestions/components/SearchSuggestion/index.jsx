import React from 'react';
import PropTypes from 'prop-types';
import List from 'Components/List';
import styles from '../../style';

/**
 * Search suggestion list entry component.
 * @param {Object} props The component props.
 * @param {string} props.suggestion The search suggestion text.
 * @param {function} props.onClick The action that is triggered on click.
 * @returns {JSX}
 */
const SearchSuggestion = ({ suggestion, onClick }) => (
  <List.Item
    className={styles.listItem}
    title={suggestion}
    onClick={onClick}
    testId={`searchSuggestion ${suggestion}`}
  />
);

SearchSuggestion.propTypes = {
  onClick: PropTypes.func.isRequired,
  suggestion: PropTypes.string.isRequired,
};

export default SearchSuggestion;
