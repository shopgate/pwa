import React from 'react';
import PropTypes from 'prop-types';
import styles from './style';
import ReviewDate from './components/ReviewDate';
import Author from './components/Author';

/**
 * Review Info Component.
 * @param {Object} props The props.
 * @returns {JSX}
 */
const Info = ({ review }) => (
  // eslint-disable-next-line jsx-a11y/aria-role
  <div className={styles} role="text">
    <ReviewDate date={review.date} />
    {' '}
    <Author author={review.author} />
  </div>
);

Info.propTypes = {
  review: PropTypes.shape(),
};

Info.defaultProps = {
  review: null,
};

export default Info;
