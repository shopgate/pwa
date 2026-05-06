import React from 'react';
import PropTypes from 'prop-types';
import RatingStars from '@shopgate/pwa-ui-shared/RatingStars';
import { makeStyles } from '@shopgate/engage/styles';

const useStyles = makeStyles()({
  container: {
    alignItems: 'center',
    display: 'flex',
    margin: '4px 0',
  },
  stars: {
    display: 'inline-block',
    lineHeight: 1,
  },
});

/**
 * Review Rating Component.
 * @param {number} rate The rating value.
 * @returns {JSX}
 */
const Rating = ({ rate }) => {
  const { classes } = useStyles();

  return (
    <div className={classes.container}>
      <RatingStars value={rate} className={classes.stars} />
    </div>
  );
};

Rating.propTypes = {
  rate: PropTypes.number,
};

Rating.defaultProps = {
  rate: 0,
};

export default Rating;
