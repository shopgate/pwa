import React from 'react';
import PropTypes from 'prop-types';
import Title from '../Title';
import Rating from '../Rating';
import Text from '../Text';
import Info from '../Info';

/**
 * Single Review Component.
 * @param {Object} props The component props.
 * @returns {JSX}
 */
const Review = ({ review }) => (
  <div data-test-id={`reviewTitle: ${review.title}`}>
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
