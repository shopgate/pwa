import React, { memo } from 'react';
import PropTypes from 'prop-types';
import { shallowEqual, useSelector } from 'react-redux';
import appConfig from '@shopgate/pwa-common/helpers/config';
import PlaceholderLabel from '@shopgate/pwa-ui-shared/PlaceholderLabel';
import { REVIEW_FEATURE_RATING_SUMMARY } from '@shopgate/pwa-common-commerce/reviews/constants';
import {
  getReviewSummary,
  hasReviewFeature,
  isProductReviewsExcerptPending,
} from '@shopgate/pwa-common-commerce/reviews/selectors';
import {
  RatingStars,
  SurroundPortals,
} from '@shopgate/engage/components';
import { PRODUCT_RATING } from '@shopgate/engage/product/constants';
import RatingCount from '@shopgate/engage/reviews/components/Reviews/components/RatingCount';
import { useShowEmptyRatingStars } from '@shopgate/engage/product/hooks';
import { makeStyles } from '@shopgate/engage/styles';

const useStyles = makeStyles()(theme => ({
  container: {
    display: 'flex',
    alignItems: 'center',
    lineHeight: '12px',
    marginBottom: theme.spacing(1),
  },
  placeholder: {
    width: 120,
    height: 24,
    marginBottom: 0,
  },
}));

/**
 * Scrolls page to reviews excerpt.
 */
const scrollToRating = () => {
  const reviewsExcerpt = document.getElementById('reviewsExcerpt');

  if (
    typeof reviewsExcerpt !== 'object' ||
    !reviewsExcerpt ||
    !reviewsExcerpt.offsetTop ||
    !reviewsExcerpt.closest ||
    !reviewsExcerpt.closest('article')
  ) {
    return;
  }

  reviewsExcerpt
    .closest('article')
    .scroll(0, reviewsExcerpt.offsetTop - 30);
};

/**
 * The Rating component.
 * @param {Object} props The component props.
 * @return {JSX.Element}
 */
const Rating = ({ productId }) => {
  const { classes, cx } = useStyles();
  const summary = useSelector(state => getReviewSummary(state, { productId }), shallowEqual);
  const isSummaryPending = useSelector(state => (
    hasReviewFeature(state, REVIEW_FEATURE_RATING_SUMMARY)
    && isProductReviewsExcerptPending(state, { productId })
  ));
  const showEmptyRatingStars = useShowEmptyRatingStars();

  const showRatings = appConfig.hasReviews
    && ((summary?.average ?? 0) > 0 || (showEmptyRatingStars && Boolean(summary)));
  const showPlaceholder = appConfig.hasReviews && !summary && isSummaryPending;

  return (
    <SurroundPortals portalName={PRODUCT_RATING}>
      {showRatings &&
      <div
        className={classes.container}
        onClick={scrollToRating}
        role="presentation"
      >
        <RatingStars value={summary.average ?? 0} display="big" />
        <RatingCount count={summary.count} prominent />
      </div>}
      {showPlaceholder && (
        <div className={classes.container}>
          <PlaceholderLabel
            className={cx(classes.placeholder, 'engage__product__rating__placeholder')}
          />
        </div>
      )}
    </SurroundPortals>
  );
};

Rating.propTypes = {
  productId: PropTypes.string,
};

Rating.defaultProps = {
  productId: null,
};

export default memo(Rating);
