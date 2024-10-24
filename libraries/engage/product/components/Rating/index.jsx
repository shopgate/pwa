import React, { memo, useMemo } from 'react';
import PropTypes from 'prop-types';
import appConfig from '@shopgate/pwa-common/helpers/config';
import {
  RatingStars,
  SurroundPortals,
} from '@shopgate/engage/components';
import { PRODUCT_RATING } from '@shopgate/engage/product/constants';
import RatingCount from '@shopgate/engage/reviews/components/Reviews/components/RatingCount';
import { useWidgetSettings } from '@shopgate/engage/core/hooks';
import { container } from './style';
import connect from './connector';

const { hasReviews } = appConfig;

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
 * @return {JSX}
 */
const Rating = ({ rating }) => {
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
      <div className={container} onClick={scrollToRating} role="link" aria-hidden>
        <RatingStars value={rating.average} display="big" />
        <RatingCount count={rating.count} prominent />
      </div>
        }
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
