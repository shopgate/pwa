import React from 'react';
import PropTypes from 'prop-types';
import { themeConfig } from '@shopgate/pwa-common/helpers/config';
import { makeStyles, keyframes } from '@shopgate/engage/styles';

const rotate = keyframes({
  '100%': { transform: 'rotate(360deg)' },
});

const dash = keyframes({
  '0%': {
    strokeDasharray: '1, 200',
    strokeDashoffset: '0',
  },
  '50%': {
    strokeDasharray: '89, 200',
    strokeDashoffset: '-35px',
  },
  '100%': {
    strokeDasharray: '89, 200',
    strokeDashoffset: '-124px',
  },
});

const useStyles = makeStyles()((_theme, { paused, color, strokeWidth }) => ({
  spinner: {
    margin: 'auto',
    transformOrigin: 'center center',
    maxWidth: '100%',
    maxHeight: '100%',
    ...(!paused ? { animation: `${rotate} 1.6s linear infinite` } : {}),
  },
  circle: {
    fill: 'none',
    stroke: color,
    strokeDasharray: '1, 200',
    strokeDashoffset: 0,
    strokeLinecap: 'round',
    strokeMiterlimit: 10,
    strokeWidth,
    ...(!paused ? { animation: `${dash} 1.2s ease-in-out infinite` } : {}),
  },
}));

/**
 * The circle indicator component.
 * @param {Object} props The component props.
 * @param {Object} props.size Width and height of the circle.
 * @param {Object} props.color Color of the circle.
 * @param {Object} props.strokeWidth Stroke width of the circle.
 * @param {boolean} props.paused Animation should be paused.
 * @returns {JSX}
 */
const IndicatorCircle = ({
  size,
  color,
  strokeWidth,
  paused,
}) => {
  const { classes, cx } = useStyles({
    paused,
    color,
    strokeWidth,
  });

  return (
    <svg
      className={cx(classes.spinner, 'ui-shared__indicator-circle')}
      viewBox="25 25 50 50"
      width={size}
      height={size}
      xmlns="http://www.w3.org/2000/svg"
      data-test-id="loadingIndicator"
    >
      <circle
        className={classes.circle}
        cx="50"
        cy="50"
        r="20"
      />
    </svg>
  );
};

IndicatorCircle.propTypes = {
  color: PropTypes.string,
  paused: PropTypes.bool,
  size: PropTypes.number,
  strokeWidth: PropTypes.number,
};

IndicatorCircle.defaultProps = {
  color: 'var(--color-secondary)',
  paused: false,
  size: themeConfig.variables.loadingIndicator.size,
  strokeWidth: themeConfig.variables.loadingIndicator.strokeWidth,
};

export default IndicatorCircle;
