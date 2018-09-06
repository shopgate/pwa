import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import I18n from '@shopgate/pwa-common/components/I18n';
import RatingNumber from '@shopgate/pwa-ui-shared/RatingNumber';
import appConfig from '@shopgate/pwa-common/helpers/config';
import AverageRating from './components/AverageRating';
import WriteReviewLink from './components/WriteReviewLink';
import styles from './style';

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

  const { average = 0 } = rating;
  const containerClass = withTopGap ? styles.withTopGapContainer : styles.container;

  if (!average) {
    return (
      <div className={styles.container}>
        <AverageRating rating={rating} productId={productId} />
        <div className={styles.noReviews}>
          {appConfig.showWriteReview && (
            <Fragment>
              <I18n.Text string="reviews.no_reviews" />
              <WriteReviewLink productId={productId} />
            </Fragment>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className={containerClass} id="reviewsExcerpt">
      <AverageRating rating={rating} productId={productId} />
      <div className={styles.reviewsLine}>
        <I18n.Text string="reviews.rating" className={styles.averageRatingText}>
          <RatingNumber rating={average} className={styles.averageRatingNumber} />
        </I18n.Text>
        {appConfig.showWriteReview && <WriteReviewLink productId={productId} />}
      </div>
    </div>
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

export default Header;
