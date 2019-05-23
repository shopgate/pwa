import React from 'react';
import PropTypes from 'prop-types';
import { RatingStars } from '@shopgate/engage/components';
import styles from './style';

/**
 * Review Rating Component.
 * @param {number} rate The rating value.
 * @returns {JSX}
 */
const Rating = ({ rate }) => (
  <div className={styles.container}>
    <RatingStars value={rate} className={styles.stars} />
  </div>
);

Rating.propTypes = {
  rate: PropTypes.number,
};

Rating.defaultProps = {
  rate: 0,
};

export default Rating;
