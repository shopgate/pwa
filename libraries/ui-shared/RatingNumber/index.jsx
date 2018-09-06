import React from 'react';
import PropTypes from 'prop-types';
import I18n from '@shopgate/pwa-common/components/I18n';
import { RATING_SCALE_DIVISOR } from '../RatingStars/constants';

/**
 * Rating number component.
 * @param {Object} props Props.
 * @param {number} props.rating Rating value.
 * @param {string} props.className Class name.
 * @returns {JSX}
 */
const RatingNumber = ({ rating, className }) => {
  if (!rating && rating !== 0) {
    return null;
  }

  const number = rating / RATING_SCALE_DIVISOR;

  if (Number.isNaN(number)) {
    return null;
  }

  return <I18n.Number number={number} className={className} fractions={2} />;
};

RatingNumber.propTypes = {
  className: PropTypes.string,
  rating: PropTypes.number,
};

RatingNumber.defaultProps = {
  className: '',
  rating: null,
};

export default RatingNumber;
