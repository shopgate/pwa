import React, { memo } from 'react';
import PropTypes from 'prop-types';
import { makeStyles, keyframes } from '@shopgate/engage/styles';

const pulse = keyframes({
  '0%': { opacity: 1 },
  '50%': { opacity: 0.5 },
  '100%': { opacity: 1 },
});

const useStyles = makeStyles()(theme => ({
  root: {
    background: theme.palette.background.emphasized,
    position: 'relative',
    animation: `${pulse} 1.5s ease-in-out infinite`,
    '@media (prefers-reduced-motion: reduce)': {
      animation: 'none',
    },
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
  const { classes, cx } = useStyles();

  const style = {
    height,
    left,
    top,
    width,
    ...rest,
  };

  return (
    <div
      className={cx(classes.root, 'ui-shared__placeholder')}
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
