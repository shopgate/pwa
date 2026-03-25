import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import appConfig, { themeConfig } from '@shopgate/pwa-common/helpers/config';
import { I18n, RatingNumber } from '@shopgate/engage/components';
import { makeStyles } from '@shopgate/engage/styles';
import AverageRating from '../AverageRating';
import WriteReviewLink from '../WriteReviewLink';

const { variables } = themeConfig;

const useStyles = makeStyles()({
  container: {
    fontWeight: 500,
    margin: 0,
  },
  withTopGapContainer: {
    fontWeight: 500,
    margin: 0,
    marginTop: variables.gap.xbig,
  },
  reviewsLine: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    padding: `0 0 ${variables.gap.small}px`,
    marginBottom: -2,
  },
  averageRatingNumber: {
    color: 'var(--color-primary)',
    marginLeft: variables.gap.small,
  },
  averageRatingText: {
    marginLeft: variables.gap.big,
  },
});

/**
 * @param {Object} props The component props.
 * @returns {JSX.Element}
 */
const ReviewsExcerpt = ({
  productId, average, count, withTopGap,
}) => {
  const { classes } = useStyles();

  return (
    <div
      className={classNames('engage__reviews__reviews-excerpt', {
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
