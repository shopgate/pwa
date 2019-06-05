import React from 'react';
import PropTypes from 'prop-types';
import appConfig from '@shopgate/pwa-common/helpers/config';
import { RATING_SCALE_DIVISOR, NUMBER_OF_STARS } from '../constants';
import connect from './connector';

const { hasReviews } = appConfig;

/**
 * The RatingStarsAria component.
 * @param {Object} props The component props.
 * @param {Object} context The component context.
 * @return {JSX}
 */
const RatingStarsAria = ({ product }, context) => {
  if (!hasReviews || !product || !product.rating || product.rating.average === 0) {
    return null;
  }

  const { __ } = context.i18n();
  const label = __('reviews.rating_stars', {
    rate: product.rating.average / RATING_SCALE_DIVISOR,
    maxRate: NUMBER_OF_STARS,
  });

  return <span aria-label={label} />;
};

RatingStarsAria.propTypes = {
  product: PropTypes.shape().isRequired,
};

RatingStarsAria.contextTypes = {
  i18n: PropTypes.func,
};

export default connect(RatingStarsAria);
