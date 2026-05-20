import React from 'react';
import PropTypes from 'prop-types';
import appConfig from '@shopgate/pwa-common/helpers/config';
import { I18n, RatingNumber } from '@shopgate/engage/components';
import { makeStyles } from '@shopgate/engage/styles';
import AverageRating from '../AverageRating';
import WriteReviewLink from '../WriteReviewLink';

const useStyles = makeStyles()(theme => ({
  container: {
    fontWeight: 500,
    margin: 0,
  },
  withTopGapContainer: {
    fontWeight: 500,
    margin: 0,
    marginTop: theme.spacing(4),
  },
  reviewsLine: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    padding: theme.spacing(0, 0, 1),
    marginBottom: -2,
  },
  averageRatingNumber: {
    color: 'var(--color-primary)',
    marginLeft: theme.spacing(1),
  },
  averageRatingText: {
    marginLeft: theme.spacing(2),
  },
}));

/**
 * @param {Object} props The component props.
 * @returns {JSX.Element}
 */
const ReviewsExcerpt = ({
  productId, average, count, withTopGap,
}) => {
  const { classes, cx } = useStyles();

  return (
    <div
      className={cx('engage__reviews__reviews-excerpt', {
        [classes.withTopGapContainer]: withTopGap,
        [classes.container]: !withTopGap,
      })}
      id="reviewsExcerpt"
    >
      <AverageRating productId={productId} average={average} count={count} />
      <div className={classes.reviewsLine}>
        <I18n.Text string="reviews.rating" className={classes.averageRatingText}>
          <RatingNumber rating={average} className={classes.averageRatingNumber} />
        </I18n.Text>
        {appConfig.showWriteReview && (
          <WriteReviewLink productId={productId} />
        )}
      </div>
    </div>
  );
};

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
