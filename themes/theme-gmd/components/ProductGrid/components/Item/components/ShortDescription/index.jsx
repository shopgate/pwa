import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles, responsiveMediaQuery } from '@shopgate/engage/styles';

const useStyles = makeStyles()({
  wrapper: {
    display: 'none',
    [responsiveMediaQuery('>xs', { webOnly: true })]: {
      display: 'block',
      color: 'var(--color-text-medium-emphasis)',
    },
  },
});

/**
 * The ShortDescription component.
 * @param {Object} props - The component props.
 * @param {string} props.shortDescription - The short description HTML string.
 * @returns {JSX.Element|null} The rendered component or null.
 */
const ShortDescription = ({ shortDescription }) => {
  const { classes } = useStyles();
  if (!shortDescription) {
    return null;
  }

  return (
    // eslint-disable-next-line react/no-danger
    <div className={classes.wrapper} dangerouslySetInnerHTML={{ __html: shortDescription }} />
  );
};

ShortDescription.propTypes = {
  shortDescription: PropTypes.string,
};

ShortDescription.defaultProps = {
  shortDescription: null,
};

export default ShortDescription;
