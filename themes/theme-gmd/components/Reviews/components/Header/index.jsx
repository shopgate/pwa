import React from 'react';
import PropTypes from 'prop-types';
import NoReviews from './components/NoReviews';
import ReviewsExcerpt from './components/ReviewsExcerpt';
import connect from './connector';

/**
 * The header of the reviews component
 * @param {Object} rating The rating values
 * @param {bool} withTopGap Adds additional top gap when true.
 * @returns {JSX}
 */
const Header = ({ productId, rating, withTopGap }) => {
  if (!rating) {
    return null;
  }

  const { average = 0, count = 0 } = rating;

  if (!average) {
    return <NoReviews productId={productId} />;
  }

  return (
    <ReviewsExcerpt productId={productId} average={average} count={count} withTopGap={withTopGap} />
  );
};

Header.propTypes = {
  productId: PropTypes.string,
  rating: PropTypes.shape(),
  withTopGap: PropTypes.bool,
};

Header.defaultProps = {
  productId: null,
  rating: null,
  withTopGap: false,
};

export default connect(Header);
