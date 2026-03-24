import React, { memo } from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@shopgate/engage/styles';

const useStyles = makeStyles()(() => ({
  root: {
    background: 'var(--color-background-accent)',
    position: 'relative',
  },
}));

/**
 * The placeholder component.
 * @param {Object} props Props (also spread to style).
 * @returns {JSX.Element}
 */
const Placeholder = ({
  height,
  left,
  top,
  width,
  ...rest
}) => {
  const { classes } = useStyles();

  const style = {
    height,
    left,
    top,
    width,
    ...rest,
  };

  return (
    <div
      className={`${classes.root} ui-shared__placeholder`}
      style={style}
    />
  );
};

Placeholder.propTypes = {
  height: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.string,
  ]),
  left: PropTypes.number,
  top: PropTypes.number,
  width: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.string,
  ]),
};

Placeholder.defaultProps = {
  height: 0,
  left: 0,
  top: 0,
  width: 0,
};

export default memo(Placeholder);
