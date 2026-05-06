import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@shopgate/engage/styles';
import ReviewDate from './components/ReviewDate';
import Author from './components/Author';

const useStyles = makeStyles()({
  root: {
    color: 'var(--color-text-medium-emphasis)',
    fontSize: 14,
  },
});

/**
 * Review Info Component.
 * @param {Object} props The props.
 * @returns {JSX}
 */
const Info = ({ review }) => {
  const { classes } = useStyles();

  return (
    // eslint-disable-next-line jsx-a11y/aria-role
    <div className={classes.root} role="text">
      <ReviewDate date={review.date} />
      {' '}
      <Author author={review.author} />
    </div>
  );
};

Info.propTypes = {
  review: PropTypes.shape(),
};

Info.defaultProps = {
  review: null,
};

export default Info;
