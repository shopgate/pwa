import React from 'react';
import PropTypes from 'prop-types';
import { Typography } from '@shopgate/engage/components';
import ReviewDate from './components/ReviewDate';
import Author from './components/Author';

/**
 * Review Info Component.
 * @param {Object} props The props.
 * @returns {JSX}
 */
const Info = ({ review }) => (
  // eslint-disable-next-line jsx-a11y/aria-role
  <Typography variant="body2" component="div" color="textSecondary" role="text">
    <ReviewDate date={review.date} />
    {' '}
    <Author author={review.author} />
  </Typography>
);

Info.propTypes = {
  review: PropTypes.shape(),
};

Info.defaultProps = {
  review: null,
};

export default Info;
