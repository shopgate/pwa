import React from 'react';
import PropTypes from 'prop-types';
import { hasReviews } from '@shopgate/pwa-common/helpers/config';
import RatingStars from '@shopgate/pwa-ui-shared/RatingStars';
import RatingCount from 'Components/Reviews/components/RatingCount';
import { container } from './style';
import connect from './connector';

/**
 * Scrolls page to reviews excerpt.
 */
const scrollToRating = () => {
  const reviewsExcerpt = document.getElementById('reviewsExcerpt');
  if (
    typeof reviewsExcerpt !== 'object'
    || !reviewsExcerpt
    || !reviewsExcerpt.offsetTop
    || !reviewsExcerpt.closest
    || !reviewsExcerpt.closest('article')
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
  if (!hasReviews || !rating || !rating.count) {
    return null;
  }

  return (
    // eslint-disable-next-line jsx-a11y/no-static-element-interactions
    <div role="link" className={container} onClick={scrollToRating}>
      <RatingStars value={rating.average} display="big" />
      <RatingCount count={rating.count} prominent />
    </div>
  );
};

Rating.propTypes = {
  rating: PropTypes.shape(),
};

Rating.defaultProps = {
  rating: null,
};

export default connect(Rating);
