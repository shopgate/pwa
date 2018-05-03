import React from 'react';
import PropTypes from 'prop-types';
import { RATING_SCALE_DIVISOR } from '@shopgate/pwa-ui-shared/RatingStars/constants';
import I18n from '@shopgate/pwa-common/components/I18n';
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
const Header = ({ rating, withTopGap }) => {
  if (!rating) {
    return null;
  }
  const { average = 0 } = rating;
  const containerClass = withTopGap ? styles.withTopGapContainer : styles.container;

  if (!average) {
    return (
      <div className={styles.container}>
        <AverageRating rating={rating} />
        <div className={styles.noReviews}>
          {appConfig.showWriteReview && (<I18n.Text string="reviews.no_reviews" />)}
          {appConfig.showWriteReview && (<WriteReviewLink />)}
        </div>
      </div>
    );
  }

  return (
    <div className={containerClass} id="reviewsExcerpt">
      <AverageRating rating={rating} />
      <div className={styles.reviewsLine}>
        <I18n.Text string="reviews.rating" className={styles.averageRatingText}>
          <span className={styles.averageRatingNumber}>
            {average / RATING_SCALE_DIVISOR}
          </span>
        </I18n.Text>
        {appConfig.showWriteReview && (<WriteReviewLink />)}
      </div>
    </div>
  );
};

Header.propTypes = {
  rating: PropTypes.shape(),
  withTopGap: PropTypes.bool,
};

Header.defaultProps = {
  rating: null,
  withTopGap: false,
};

export default Header;
