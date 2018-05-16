import React from 'react';
import PropTypes from 'prop-types';
import RatingStars from '@shopgate/pwa-ui-shared/RatingStars';
import RatingCount from 'Components/Reviews/components/RatingCount';
import { container } from './style';

/**
 * The average rating and number of ratings for a product.
 * @param {Object} rating The rating values.
 * @returns {JSX}
 */
const AverageRating = ({ rating }) => {
  const { average = 0, count = 0 } = rating;

  return (
    <div className={container} >
      <RatingStars value={average} display="large" />
      <RatingCount count={count} />
    </div>
  );
};

AverageRating.propTypes = {
  rating: PropTypes.shape(),
};

AverageRating.defaultProps = {
  rating: {
    average: 0,
    count: 0,
  },
};

export default AverageRating;
