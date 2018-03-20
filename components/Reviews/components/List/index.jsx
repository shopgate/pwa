import React from 'react';
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
    <div>
      {reviews.map((review, key) => (
        // eslint-disable-next-line react/no-array-index-key
        <Review key={key} review={review} />
      ))}
    </div>
  );
};

List.propTypes = {
  reviews: PropTypes.arrayOf(PropTypes.shape()),
};

List.defaultProps = {
  reviews: null,
};

export default List;
