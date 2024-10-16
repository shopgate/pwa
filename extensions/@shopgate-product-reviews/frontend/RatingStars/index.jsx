import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { hot } from 'react-hot-loader';
import appConfig from '@shopgate/pwa-common/helpers/config';
import { useWidgetSettings } from '@shopgate/engage/core/hooks';
import Stars from './components/Stars';
import connect from './connector';

const { hasReviews } = appConfig;

/**
 * The RatingStars component.
 * @return {JSX}
 */
const RatingStars = ({ product }) => {
  const { showEmptyRatingStars = false } = useWidgetSettings('@shopgate/engage/rating');

  const showRatings = useMemo(() => {
    if (hasReviews && product?.rating?.average > 0) {
      return true;
    }

    if (hasReviews && showEmptyRatingStars && product?.rating) {
      return true;
    }

    return false;
  }, [product, showEmptyRatingStars]);

  if (!showRatings) {
    return null;
  }

  return <Stars value={product.rating.average} />;
};

RatingStars.propTypes = {
  product: PropTypes.shape().isRequired,
};

export default hot(module)(connect(RatingStars));
