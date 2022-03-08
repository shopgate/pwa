import React from 'react';
import PropTypes from 'prop-types';
import { hot } from 'react-hot-loader';
import appConfig from '@shopgate/pwa-common/helpers/config';
import { useWidgetSettings } from '@shopgate/engage/core/hooks/useWidgetSettings';
import Stars from './components/Stars';
import connect from './connector';

const { hasReviews } = appConfig;

/**
 * The RatingStars component.
 * @return {JSX}
 */
const RatingStars = ({ product }) => {
  const { showEmptyRatingStars = false } = useWidgetSettings('@shopgate/engage/rating');
  const showRatings = showEmptyRatingStars ?
    hasReviews && product.rating && product
    :
    hasReviews && product.rating && product.rating.count;
  return (showRatings && <Stars value={product.rating.average} />);
};

RatingStars.propTypes = {
  product: PropTypes.shape().isRequired,
};

export default hot(module)(connect(RatingStars));
