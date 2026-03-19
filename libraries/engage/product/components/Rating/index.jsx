import React, { memo, useMemo } from 'react';
import PropTypes from 'prop-types';
import appConfig, { themeConfig } from '@shopgate/pwa-common/helpers/config';
import {
  RatingStars,
  SurroundPortals,
} from '@shopgate/engage/components';
import { PRODUCT_RATING } from '@shopgate/engage/product/constants';
import RatingCount from '@shopgate/engage/reviews/components/Reviews/components/RatingCount';
import { useWidgetSettings } from '@shopgate/engage/core/hooks';
import { makeStyles } from '@shopgate/engage/styles';
import connect from './connector';

const { hasReviews } = appConfig;
const { variables } = themeConfig;

const useStyles = makeStyles()({
  container: {
    display: 'flex',
    alignItems: 'center',
    lineHeight: '12px',
    marginBottom: variables.gap.small,
  },
});

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
const Rating = ({ rating }) => {
  const { classes } = useStyles();
  const { showEmptyRatingStars = false } = useWidgetSettings('@shopgate/engage/rating');

  const showRatings = useMemo(() => {
    if (hasReviews && rating?.average > 0) {
      return true;
    }

    if (hasReviews && showEmptyRatingStars && rating) {
      return true;
    }

    return false;
  }, [rating, showEmptyRatingStars]);

  return (
    <SurroundPortals portalName={PRODUCT_RATING}>
      {showRatings &&
      <div
        className={classes.container}
        onClick={scrollToRating}
        role="presentation"
      >
        <RatingStars value={rating.average} display="big" />
        <RatingCount count={rating.count} prominent />
      </div>}
    </SurroundPortals>
  );
};

Rating.propTypes = {
  rating: PropTypes.shape(),
};

Rating.defaultProps = {
  rating: null,
};

export default connect(memo(Rating));
