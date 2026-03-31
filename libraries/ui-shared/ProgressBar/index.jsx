import React, { useEffect, useState, memo } from 'react';
import PropTypes from 'prop-types';
import Color from 'color';
import Transition from 'react-transition-group/Transition';
import UIEvents from '@shopgate/pwa-core/emitters/ui';
import { themeConfig } from '@shopgate/pwa-common/helpers/config';
import { getCSSCustomProp, makeStyles, keyframes } from '@shopgate/engage/styles';

const duration = 150;

const transitionStyles = {
  entering: {
    transform: 'scale(1, 1)',
  },
  entered: {
    transform: 'scale(1, 1)',
  },
  exited: {
    transform: 'scale(1, 0)',
  },
  exiting: {
    transform: 'scale(1, 0)',
  },
};

const { colors } = themeConfig;

const progressBarHeight = 4;

const indeterminateLong = keyframes({
  '0%': {
    left: '-35%',
    right: '100%',
  },
  '60%': {
    left: '100%',
    right: '-90%',
  },
  '100%': {
    left: '100%',
    right: '-90%',
  },
});

const indeterminateShort = keyframes({
  '0%': {
    left: '-200%',
    right: '100%',
  },
  '60%': {
    left: '107%',
    right: '-8%',
  },
  '100%': {
    left: '107%',
    right: '-8%',
  },
});

const useStyles = makeStyles()({
  innerElement: {
    ':before': {
      content: '""',
      position: 'absolute',
      background: 'var(--color-secondary)',
      top: 0,
      left: 0,
      bottom: 0,
      willChange: 'left, right',
    },
    ':after': {
      content: '""',
      position: 'absolute',
      background: 'var(--color-secondary)',
      top: 0,
      left: 0,
      bottom: 0,
      willChange: 'left, right',
    },
  },
  animating: {
    ':before': {
      animation: `${indeterminateLong} 2.1s cubic-bezier(0.65, 0.815, 0.735, 0.395) infinite`,
    },
    ':after': {
      animation: `${indeterminateShort} 2.1s cubic-bezier(0.165, 0.84, 0.44, 1) infinite`,
      animationDelay: '1.15s',
    },
  },
});

/**
 * A component for visualizing any kind of progress.
 * This component will show the current progress in a linear bar.
 */
const ProgressBar = memo(({ isVisible }) => {
  const { classes, cx } = useStyles();
  const [isAnimating, setIsAnimating] = useState(isVisible);
  const [visible, setVisible] = useState(isVisible);

  useEffect(() => {
    if (isVisible) {
      setIsAnimating(true);
      setVisible(true);
    } else {
      setVisible(false);
    }
  }, [isVisible]);

  const wrapperBackground = Color(getCSSCustomProp('--color-secondary') || colors.accent).fade(0.6);

  return (
    <Transition
      in={visible}
      timeout={duration}
      onExited={() => { setIsAnimating(false); }}
    >
      {state => (
        <div
          className="ui-shared__progress-bar"
          style={{
            position: 'absolute',
            bottom: 0,
            background: wrapperBackground,
            width: '100%',
            height: progressBarHeight,
            overflow: 'hidden',
            transition: 'transform 150ms cubic-bezier(0.25, 0.1, 0.25, 1)',
            zIndex: 10,
            ...transitionStyles[state],
          }}
        >
          <div
            className={cx(
              classes.innerElement,
              isAnimating && classes.animating
            )}
          />
        </div>
      )}
    </Transition>
  );
});

ProgressBar.PROGRESS_BAR_SHOW = 'PROGRESS_BAR_SHOW';

ProgressBar.PROGRESS_BAR_HIDE = 'PROGRESS_BAR_HIDE';

/**
 * Shows the progress bar.
 * @param {string} pattern The router pattern to show the bar for.
 */
ProgressBar.show = (pattern) => {
  UIEvents.emit(ProgressBar.PROGRESS_BAR_SHOW, pattern);
};

/**
 * Hides the progress bar.
 * @param {string} pattern The router pattern to hide the bar from.
 */
ProgressBar.hide = (pattern) => {
  UIEvents.emit(ProgressBar.PROGRESS_BAR_HIDE, pattern);
};

ProgressBar.propTypes = {
  isVisible: PropTypes.bool,
};

ProgressBar.defaultProps = {
  isVisible: true,
};

ProgressBar.displayName = 'ProgressBar';

export default ProgressBar;
