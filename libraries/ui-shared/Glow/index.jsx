import React, {
  useState, useRef, useEffect, useCallback,
} from 'react';
import PropTypes from 'prop-types';
import { withForwardedRef } from '@shopgate/engage/core';
import { makeStyles } from '@shopgate/engage/styles';
import { themeConfig } from '@shopgate/pwa-common/helpers/config';

const useStyles = makeStyles()({
  container: {
    position: 'relative',
  },
  glow: {
    position: 'absolute',
    left: 0,
    top: 0,
    width: '100%',
    height: '100%',
    background: 'transparent',
    transition: 'background 100ms cubic-bezier(0.25, 0.1, 0.25, 1)',
    zIndex: 0,
  },
});

/**
 * Renders a glowing component that is visible when the user interacts with the element.
 * @param {Object} props Props.
 * @returns {JSX.Element}
 */
const Glow = ({
  children,
  className,
  color,
  disabled,
  forwardedRef,
  styles: propStyles = {
    container: null,
    glow: null,
    hover: null,
  },
  ...rest
}) => {
  const { classes, cx } = useStyles();
  const [hover, setHover] = useState(false);
  const timeoutRef = useRef(null);

  useEffect(() => () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
  }, []);

  const handleTouchTap = useCallback(() => {
    if (disabled) {
      return;
    }
    setHover(true);
    timeoutRef.current = setTimeout(() => setHover(false), 250);
  }, [disabled]);

  const innerInlineStyles = hover
    ? {
      ...propStyles.glow,
      ...propStyles.hover,
      background: color,
    }
    : {
      ...propStyles.glow,
    };

  /* eslint-disable jsx-a11y/no-static-element-interactions,
  jsx-a11y/click-events-have-key-events */
  return (
    <div
      {...rest}
      className={cx(classes.container, className, 'ui-shared__glow')}
      onClick={handleTouchTap}
      style={propStyles.container}
      ref={forwardedRef}
    >
      <div className={classes.glow} style={innerInlineStyles} />
      {children}
    </div>
  );
  /* eslint-enable jsx-a11y/no-static-element-interactions,
  jsx-a11y/click-events-have-key-events */
};

Glow.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
  color: PropTypes.string,
  disabled: PropTypes.bool,
  forwardedRef: PropTypes.shape(),
  styles: PropTypes.shape({
    container: PropTypes.shape(),
    glow: PropTypes.shape(),
    hover: PropTypes.shape(),
  }),
};

Glow.defaultProps = {
  color: themeConfig.colors.shade8,
  className: null,
  forwardedRef: null,
  disabled: false,
  styles: {
    container: null,
    glow: null,
    hover: null,
  },
};

export default withForwardedRef(Glow);
