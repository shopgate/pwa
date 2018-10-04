import React from 'react';
import PropTypes from 'prop-types';
import styles from './style';
import Title from './components/Title';
import Rating from './components/Rating';
import Text from './components/Text';
import Info from './components/Info';

/**
 * Single Review Component.
 * @param {Object} props The component props.
 * @returns {JSX}
 */
const Review = ({ review }) => (
  <div className={styles} data-test-id={`reviewTitle: ${review.title}`}>
    <Title title={review.title} />
    <Rating rate={review.rate} />
    <Text review={review.review} />
    <Info review={review} />
  </div>
);

Review.propTypes = {
  review: PropTypes.shape().isRequired,
};

export default Review;
