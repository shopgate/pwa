import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import appConfig from '@shopgate/pwa-common/helpers/config';
import I18n from '@shopgate/pwa-common/components/I18n';
import RatingNumber from '@shopgate/pwa-ui-shared/RatingNumber';
import AverageRating from '../AverageRating';
import WriteReviewLink from '../WriteReviewLink';
import * as styles from './style';

/**
 * @param {Object} props The component props.
 * @returns {JSX}
 */
const ReviewsExcerpt = ({
  productId, average, count, withTopGap,
}) => (
  <div
    className={classNames({
      [styles.withTopGapContainer]: withTopGap,
      [styles.container]: !withTopGap,
    })}
    id="reviewsExcerpt"
  >
    <AverageRating productId={productId} average={average} count={count} />
    <div className={styles.reviewsLine}>
      <I18n.Text string="reviews.rating">
        <RatingNumber rating={average} className={styles.averageRatingNumber} />
      </I18n.Text>
      {appConfig.showWriteReview && (
        <WriteReviewLink productId={productId} />
      )}
    </div>
  </div>
);

ReviewsExcerpt.propTypes = {
  average: PropTypes.number,
  count: PropTypes.number,
  productId: PropTypes.string,
  withTopGap: PropTypes.bool,
};

ReviewsExcerpt.defaultProps = {
  average: 0,
  count: 0,
  productId: null,
  withTopGap: false,
};

export default ReviewsExcerpt;
