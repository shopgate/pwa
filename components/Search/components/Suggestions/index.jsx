import React from 'react';
import PropTypes from 'prop-types';
import List from './components/List';
import styles from './style';

/**
 * The Suggestions component.
 * @param {Object} props The component props.
 * @returns {JSX}
 */
const Suggestions = ({ onClick, searchPhrase }) => (
  <section className={styles}>
    <List onClick={onClick} searchPhrase={searchPhrase} />
  </section>
);

Suggestions.propTypes = {
  onClick: PropTypes.func.isRequired,
  searchPhrase: PropTypes.string.isRequired,
};

export default Suggestions;
