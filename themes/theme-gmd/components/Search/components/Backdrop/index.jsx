import React from 'react';
import PropTypes from 'prop-types';
import styles from './style';

/**
 * The SuggestionsBackdrop component.
 * @return {JSX}
 */
const SuggestionsBackdrop = ({ onClick }) => (
  <div aria-hidden className={styles} onClick={onClick} />
);

SuggestionsBackdrop.propTypes = {
  onClick: PropTypes.func.isRequired,
};

export default SuggestionsBackdrop;
