import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@shopgate/engage/styles';

const useStyles = makeStyles()({
  root: {
    fontWeight: 500,
    lineHeight: '20px',
  },
});

/**
 * Review Title Component.
 * @param {string} title The title of the review.
 * @returns {JSX}
 */
const Title = ({ title }) => {
  const { classes } = useStyles();

  return <div className={classes.root}>{title}</div>;
};

Title.propTypes = {
  title: PropTypes.string,
};

Title.defaultProps = {
  title: null,
};

export default Title;
