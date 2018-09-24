import React from 'react';
import PropTypes from 'prop-types';
import appConfig from '@shopgate/pwa-common/helpers/config';
import connect from './connector';
import styles from './style';
import List from './components/List';
import Header from './components/Header';
import AllReviewsLink from './components/AllReviewsLink';

/**
 * Reviews Component
 * @param {Object} rating Rating of the product.
 * @param {Array} reviews Reviews which should be shown in the product page.
 * @returns {JSX|null}
 */
const Reviews = ({ rating, reviews }) => {
  if (!appConfig.hasReviews) {
    return null;
  }

  return (
    <div className={styles.container} data-test-id="reviewSection">
      <Header rating={rating} />
      <List reviews={reviews} />
      <AllReviewsLink />
    </div>
  );
};

Reviews.propTypes = {
  rating: PropTypes.shape(),
  reviews: PropTypes.arrayOf(PropTypes.shape()),
};

Reviews.defaultProps = {
  rating: null,
  reviews: null,
};

export default connect(Reviews);
