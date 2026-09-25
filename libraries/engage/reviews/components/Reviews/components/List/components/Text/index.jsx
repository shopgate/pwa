import React from 'react';
import PropTypes from 'prop-types';
import { Typography } from '@shopgate/engage/components';
import { makeStyles } from '@shopgate/engage/styles';

const useStyles = makeStyles()({
  root: {
    fontStyle: 'italic',
    whiteSpace: 'pre-line',
  },
});

/**
 * Review Text Component
 * @param {string} review The review text
 * @returns {JSX|null}
 */
const Text = ({ review }) => {
  const { classes } = useStyles();

  if (!review) {
    return null;
  }

  return (
    <Typography variant="body2" component="div" className={classes.root}>{`"${review}"`}</Typography>
  );
};

Text.propTypes = {
  review: PropTypes.string,
};

Text.defaultProps = {
  review: null,
};

export default Text;
