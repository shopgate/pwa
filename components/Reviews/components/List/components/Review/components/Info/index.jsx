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
  <div className={styles}>
    <ReviewDate date={review.date} /> <Author author={review.author} />
  </div>
);

Info.propTypes = {
  review: PropTypes.shape(),
};

Info.defaultProps = {
  review: null,
};

export default Info;
