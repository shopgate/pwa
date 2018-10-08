import React from 'react';
import PropTypes from 'prop-types';
import { hot } from 'react-hot-loader';
import appConfig from '@shopgate/pwa-common/helpers/config';
import Stars from './components/Stars';
import connect from './connector';

const { hasReviews } = appConfig;

/**
 * The RatingStars component.
 * @return {JSX}
 */
const RatingStars = ({ product }) => {
  if (!hasReviews || !product || !product.rating || product.rating.average === 0) {
    return null;
  }

  return <Stars value={product.rating.average} />;
};

RatingStars.propTypes = {
  product: PropTypes.shape().isRequired,
};

export default hot(module)(connect(RatingStars));
