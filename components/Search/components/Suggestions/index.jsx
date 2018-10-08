import React from 'react';
import PropTypes from 'prop-types';
import Backdrop from './components/Backdrop';
import List from './components/List';
import styles from './style';

/**
 * The Suggestions component.
 * @param {Object} props The component props.
 * @returns {JSX}
 */
const Suggestions = ({ onClick, searchPhrase }) => {
  return (
    <section className={styles}>
      <Backdrop />
      <List onClick={onClick} searchPhrase={searchPhrase} />
    </section>
  );
};

Suggestions.propTypes = {
  onClick: PropTypes.func.isRequired,
  searchPhrase: PropTypes.string.isRequired,
};

export default Suggestions;
