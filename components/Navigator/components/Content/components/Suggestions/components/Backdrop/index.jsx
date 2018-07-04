import React from 'react';
import PropTypes from 'prop-types';
import styles from './style';
import inject from './injector';

/**
 * The SuggestionsBackdrop component
 * @return {JSX}
 */
const SuggestionsBackdrop = ({ toggleSearchField }) => (
  <div
    aria-hidden
    className={styles}
    onClick={() => toggleSearchField(false)}
  />
);

SuggestionsBackdrop.propTypes = {
  toggleSearchField: PropTypes.func.isRequired,
};

export default inject(SuggestionsBackdrop);
