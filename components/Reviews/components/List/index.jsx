import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import Review from './components/Review';

/**
 * Review List Component
 * @param {Object} reviews A list of reviews
 * @returns {JSX|null}
 */
const List = ({ reviews }) => {
  if (!reviews || !reviews.length) {
    return null;
  }

  return (
    <Fragment>
      {reviews.map(review => (
        <Review key={review.id} review={review} />
      ))}
    </Fragment>
  );
};

List.propTypes = {
  reviews: PropTypes.arrayOf(PropTypes.shape()),
};

List.defaultProps = {
  reviews: null,
};

export default List;
