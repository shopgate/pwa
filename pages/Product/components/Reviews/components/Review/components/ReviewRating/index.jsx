import React from 'react';
import PropTypes from 'prop-types';
import I18n from '@shopgate/pwa-common/components/I18n';
import RatingStars from '../../../../../../../../components/RatingStars';
import style from './style';

/**
 * Review Rating Component
 * @param {number} rate The rating value
 * @constructor
 */
const ReviewRating = ({ rate }) => {
  let stars = 1;
  if (rate > 20) {
    stars = rate / 20;
  }

  return (
    <div>
      <RatingStars
        value={rate / 100}
        className={style.stars}
      />
      <I18n.Text
        string="reviews.rating_stars"
        params={[stars]}
        className={style.text}
      />
    </div>
  );
};

ReviewRating.propTypes = {
  rate: PropTypes.number,
};

ReviewRating.defaultProps = {
  rate: null,
};

export default ReviewRating;
