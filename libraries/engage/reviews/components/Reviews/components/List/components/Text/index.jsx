import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@shopgate/engage/styles';

const useStyles = makeStyles()({
  root: {
    fontSize: 14,
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
    <div className={classes.root}>{`"${review}"`}</div>
  );
};

Text.propTypes = {
  review: PropTypes.string,
};

Text.defaultProps = {
  review: null,
};

export default Text;
