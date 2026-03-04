import { forwardRef } from 'react';
import { makeStyles, keyframes } from '@shopgate/engage/styles';
import type { PaletteColorsWithMain } from '@shopgate/engage/styles';

export interface CircularProgressProps {
  /**
   * Color for the circular progress
   */
  color?: PaletteColorsWithMain | 'inherit';
  /**
   * The size of the circular progress in pixels
   * @default 40
   */
  size?: number;
  /**
   * The thickness of the circular progress circle
   * @default 3.6
   */
  thickness?: number;
  /**
   * If `true`, the shrink animation is disabled.
   * @default false
   */
  disableShrink?: boolean;
  /**
   * The current value of the circular progress (for determinate variant)
   * @default 0
   */
  value?: number;
  /**
   * The variant of the circular progress
   * @default 'indeterminate'
   */
  variant?: 'indeterminate' | 'determinate';
  /**
   * Custom styles for the circular progress
   */
  style?: React.CSSProperties;
  /**
   * Custom class name for the circular progress
   */
  className?: string;
}

const circularRotate = keyframes({
  '0%': {
    transform: 'rotate(0deg)',
  },
  '100%': {
    transform: 'rotate(360deg)',
  },
});

const circularDash = keyframes({
  '0%': {
    strokeDasharray: '1px, 200px',
    strokeDashoffset: 0,
  },
  '50%': {
    strokeDasharray: '100px, 200px',
    strokeDashoffset: '-15px',
  },
  '100%': {
    strokeDasharray: '100px, 200px',
    strokeDashoffset: '-120px',
  },
});

const useStyles = makeStyles<CircularProgressProps>({
  name: 'CircularProgress',
})((theme, props) => {
  const { color } = props;

  let cssColor = 'inherit';

  if (color && color !== 'inherit') {
    cssColor = theme.palette?.[color]?.main
      ? theme.palette[color].main
      : theme.palette.primary.main;
  }

  return {
    root: {
      display: 'inline-block',
      '--circle-color': cssColor,
      color: 'var(--circle-color)',
    },
    svg: {
      display: 'block',
    },
    indeterminate: {
      animation: `${circularRotate} 1.4s linear infinite`,
    },
    determinate: {
      transform: theme.transitions.create('transform'),
    },
    circle: {
      stroke: 'currentColor',
    },
    circleIndeterminate: {
      strokeDasharray: '80px, 200px',
      strokeDashoffset: 0,
      animation: `${circularDash} 1.4s ease-in-out infinite`,
    },
    circleDeterminate: {
      transition: theme.transitions.create('stroke-dashoffset'),
    },
    circleDisableShrink: {
      animation: 'none',
    },
  };
});

const SIZE = 44;

/**
 * The CircularProgress component is a visual indicator of loading or progress.
 * It can be either determinate (showing a specific progress value) or indeterminate (showing an ongoing loading state).
 */
const CircularProgress = forwardRef<HTMLDivElement, CircularProgressProps>((props, ref) => {
  const {
    color = 'primary',
    size = 40,
    value = 0,
    variant = 'indeterminate',
    disableShrink = false,
    thickness = 3.6,
    style,
    className,
    ...other
  } = props;

  const { classes, cx } = useStyles({ color });

  const circleStyle: React.CSSProperties = {};
  const rootStyle: React.CSSProperties = {};
  const rootProps: React.HTMLAttributes<HTMLDivElement> = {};

  if (variant === 'determinate') {
    const circumference = 2 * Math.PI * ((SIZE - thickness) / 2);
    circleStyle.strokeDasharray = circumference.toFixed(3);
    rootProps['aria-valuenow'] = Math.round(value);
    circleStyle.strokeDashoffset = `${(((100 - value) / 100) * circumference).toFixed(3)}px`;
    rootStyle.transform = 'rotate(-90deg)';
  }

  return (
    <div
      className={cx(classes.root, className, {
        [classes.indeterminate]: variant === 'indeterminate',
        [classes.determinate]: variant === 'determinate',
      })}
      style={{
        width: size,
        height: size,
        ...rootStyle,
        ...style,
      }}
      ref={ref}
      role="progressbar"
      {...rootProps}
      {...other}
    >
      <svg className={classes.svg} viewBox={`${SIZE / 2} ${SIZE / 2} ${SIZE} ${SIZE}`}>
        <circle
          className={cx(classes.circle, {
            [classes.circleDeterminate]: variant === 'determinate',
            [classes.circleIndeterminate]: variant === 'indeterminate',
            [classes.circleDisableShrink]: disableShrink,
          })}
          style={circleStyle}
          cx={SIZE}
          cy={SIZE}
          r={(SIZE - thickness) / 2}
          fill="none"
          strokeWidth={thickness}
        />
      </svg>
    </div>
  );
});

export default CircularProgress;
