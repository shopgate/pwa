import React from 'react';
import PropTypes from 'prop-types';
import styles from './style';

/**
 * Review Text Component
 * @param {string} review The review text
 * @returns {JSX|null}
 */
const Text = ({ review }) => {
  if (!review) {
    return null;
  }

  return (
    <div className={styles}>{`"${review}"`}</div>
  );
};

Text.propTypes = {
  review: PropTypes.string,
};

Text.defaultProps = {
  review: null,
};

export default Text;
