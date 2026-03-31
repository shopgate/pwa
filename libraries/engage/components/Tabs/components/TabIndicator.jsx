import * as React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@shopgate/engage/styles';

const useStyles = makeStyles()({
  root: {
    position: 'absolute',
    height: 2,
    bottom: 0,
    width: '100%',
    transition: 'left .2s ease',
    backgroundColor: 'var(--color-primary)',
  },
});

/**
 * Tab indicator component
 * @param {Object} props props
 * @returns {JSX}
 */
const TabIndicator = ({ className, ...other }) => {
  const { classes, cx } = useStyles();

  return (
    <span
      className={cx(classes.root, className)}
      {...other}
    />
  );
};

TabIndicator.propTypes = {
  className: PropTypes.string,
};

TabIndicator.defaultProps = {
  className: null,
};

export default TabIndicator;
