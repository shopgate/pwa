import React, { memo } from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import appConfig from '@shopgate/pwa-common/helpers/config';
import { getProductRating } from '@shopgate/pwa-common-commerce/product/selectors/product';
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
  const { classes } = useStyles();
  const rating = useSelector(state => getProductRating(state, { productId }));
  const showEmptyRatingStars = useShowEmptyRatingStars();

  const showRatings = appConfig.hasReviews
    && ((rating?.average ?? 0) > 0 || (showEmptyRatingStars && Boolean(rating)));

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
  productId: PropTypes.string,
};

Rating.defaultProps = {
  productId: null,
};

export default memo(Rating);
