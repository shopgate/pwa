import React, { useState, useRef, useEffect } from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import { makeStyles } from '@shopgate/engage/styles';

const useStyles = makeStyles()(() => ({
  wrapper: {
    display: 'inline-block',
    position: 'relative',
    cursor: 'help',
  },
  tooltipBox: {
    position: 'absolute',
    padding: '6px 10px',
    backgroundColor: 'rgba(0, 0, 0, 0.87)',
    color: '#fff',
    fontSize: '0.875rem',
    fontWeight: 400,
    borderRadius: '4px',
    whiteSpace: 'normal', // allow multiline
    wordBreak: 'break-word',
    maxWidth: '200px',
    zIndex: 1000,
    pointerEvents: 'none',
    opacity: 0,
    transform: 'scale(0.9)',
    transition: 'opacity 0.1s ease-in-out, transform 0.1s ease-in-out',
    '&[data-visible="true"]': {
      opacity: 1,
      transform: 'scale(1)',
    },
  },
  arrowTop: {
    '&::before': {
      content: "''",
      position: 'absolute',
      bottom: '-6px',
      left: 'var(--arrow-left, 50%)',
      transform: 'translateX(-50%)',
      borderWidth: '6px 6px 0 6px',
      borderStyle: 'solid',
      borderColor: 'rgba(0, 0, 0, 0.87) transparent transparent transparent',
    },
  },
  arrowBottom: {
    '&::before': {
      content: "''",
      position: 'absolute',
      top: '-6px',
      left: 'var(--arrow-left, 50%)',
      transform: 'translateX(-50%) rotate(180deg)',
      borderWidth: '6px 6px 0 6px',
      borderStyle: 'solid',
      borderColor: 'rgba(0, 0, 0, 0.87) transparent transparent transparent',
    },
  },
}));

/**
 * AI generated Tooltip component to display additional information on hover.
 * @param {Object} props The component props.
 * @param {React.ReactNode} props.children The child elements to wrap.
 * @param {string} props.text The tooltip text to display.
 * @returns {JSX.Element}
 */
function Tooltip({ children, text }) {
  const { classes, cx } = useStyles();
  const wrapperRef = useRef(null);
  const [visible, setVisible] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [animate, setAnimate] = useState(false);
  const [coords, setCoords] = useState({
    left: 0,
    top: 0,
  });
  const [arrowLeft, setArrowLeft] = useState(null);
  const [positionState, setPositionState] = useState('top'); // 'top' or 'bottom'
  const tooltipId = useRef(Math.random().toString(36).slice(2, 11));

  // Handle mounting/unmounting and trigger fade animation
  useEffect(() => {
    let timeoutId;
    if (visible) {
      setMounted(true);
      // allow DOM to insert before starting the fade-in
      timeoutId = setTimeout(() => setAnimate(true), 10);
    } else {
      setAnimate(false);
      // after fade-out duration, unmount
      timeoutId = setTimeout(() => setMounted(false), 200);
    }
    return () => clearTimeout(timeoutId);
  }, [visible]);

  // Compute position, flipping if needed, when mounted
  useEffect(() => {
    if (!mounted || !wrapperRef.current) return;

    const wrapperRect = wrapperRef.current.getBoundingClientRect();
    const selector = `.tooltip-box[data-tooltip-id="${tooltipId.current}"]`;
    const tooltipEl = document.querySelector(selector);
    if (!tooltipEl) return;
    const ttRect = tooltipEl.getBoundingClientRect();

    const margin = 8;
    const vw = window.innerWidth;
    const vh = window.innerHeight;

    // 1) Try "top" placement
    let left = wrapperRect.left + wrapperRect.width / 2 - ttRect.width / 2;
    let top = wrapperRect.top - ttRect.height - 8;

    // Clamp horizontal even before deciding flip, to calculate arrow offset
    if (left < margin) {
      left = margin;
    } else if (left + ttRect.width > vw - margin) {
      left = vw - ttRect.width - margin;
    }

    // If top would be too high (tooltip clipped), switch to "bottom"
    let finalPosition = 'top';
    if (top < margin) {
      // try bottom
      const bottomTop = wrapperRect.bottom + 8;
      if (bottomTop + ttRect.height <= vh - margin) {
        finalPosition = 'bottom';
        top = bottomTop;
      } else {
        // can't fit fully in bottom either; clamp top to margin
        top = margin;
      }
    }

    // If using "top", ensure vertical clamp if it goes off bottom
    if (finalPosition === 'top') {
      if (top + ttRect.height > vh - margin) {
        top = vh - ttRect.height - margin;
      }
    }
    // If using "bottom", clamp bottom if it would go off bottom
    if (finalPosition === 'bottom') {
      if (top + ttRect.height > vh - margin) {
        top = vh - ttRect.height - margin;
      }
    }

    // 2) Compute arrow offset so it points to wrapper’s center X
    const wrapperCenterX = wrapperRect.left + wrapperRect.width / 2;
    let computedArrowLeft = wrapperCenterX - left;
    // Clamp arrow within [6px, ttRect.width - 6px]
    const minArrow = 6;
    const maxArrow = ttRect.width - 6;
    if (computedArrowLeft < minArrow) {
      computedArrowLeft = minArrow;
    } else if (computedArrowLeft > maxArrow) {
      computedArrowLeft = maxArrow;
    }

    setPositionState(finalPosition);
    setCoords({
      left,
      top,
    });
    setArrowLeft(computedArrowLeft);
  }, [mounted]);

  if (!text) {
    return children;
  }

  const portalStyle = {
    left: `${coords.left}px`,
    top: `${coords.top}px`,
    ...(arrowLeft !== null ? { '--arrow-left': `${arrowLeft}px` } : {}),
  };

  const arrowClass =
    positionState === 'top' ? classes.arrowTop : classes.arrowBottom;

  return (
    <span
      className={classes.wrapper}
      ref={wrapperRef}
      data-tooltip-id={tooltipId.current}
      onMouseEnter={() => setVisible(true)}
      onMouseLeave={() => setVisible(false)}
    >
      {children}
      {mounted &&
        ReactDOM.createPortal(
          <div
            className={cx(classes.tooltipBox, arrowClass, 'tooltip-box')}
            style={portalStyle}
            data-visible={animate ? 'true' : 'false'}
            data-tooltip-id={tooltipId.current}
            dangerouslySetInnerHTML={{ __html: text }}
          />,
          document.body
        )}
    </span>
  );
}

Tooltip.propTypes = {
  children: PropTypes.node.isRequired,
  text: PropTypes.string,
};

Tooltip.defaultProps = {
  text: null,
};

export default Tooltip;
