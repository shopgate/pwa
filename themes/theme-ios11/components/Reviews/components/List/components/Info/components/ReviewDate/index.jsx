import React from 'react';
import PropTypes from 'prop-types';
import I18n from '@shopgate/pwa-common/components/I18n';

/**
 * Review Date Component.
 * @param {string} date The date of a review.
 * @returns {JSX}
 */
const ReviewDate = ({ date }) => (
  <I18n.Date timestamp={new Date(date).getTime()} format="long" />
);

ReviewDate.propTypes = {
  date: PropTypes.string,
};

ReviewDate.defaultProps = {
  date: null,
};

export default ReviewDate;
