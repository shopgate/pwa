import React, { useState, forwardRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import { makeStyles, responsiveMediaQuery } from '@shopgate/engage/styles';
import { useScrollDirectionChange, useRoute } from '@shopgate/engage/core/hooks';

const useStyles = makeStyles()({
  root: {
    position: 'sticky',
    left: 0,
    backgroundColor: '#fff',
    [responsiveMediaQuery('<=xs', { appAlways: true })]: {
      boxShadow: 'rgba(0, 0, 0, 0.118) 0px 1px 6px, rgba(0, 0, 0, 0.118) 0px 1px 4px',
    },
  },
  scrolledIn: {
    '&&': {
      transform: 'translateY(0%)',
    },
  },
  scrolledOut: {
    '&&': {
      transform: 'translateY(-250%)',
    },
  },
  transition: {
    transition: 'transform 0.2s ease,transform 0.2s',
  },
});

/* eslint-disable react/prop-types */
/**
 * A container component that hides its content on scroll down and shows it on scroll up.
 *
 * @param {Object} props The component props.
 * @param {boolean}  [props.hideOnScroll] Toggle hide-on-scroll (default: true).
 * @param {number} [props.scrollOffset] Pixels to scroll before toggling (default: 100).
 * @param {boolean} [props.onlyShowAtTop] When set to true, the component content will not be shown
 * till the user scrolls to the top of the page again.
 * @param {number} [props.onlyShowAtTopOffset] Pixel threshold from the top of the page at which the
 * component content will reappear when `showOnScrollToTop` is enabled. The content shows again once
 * the scroll position is less than or equal to this value.
 * @param {Function} [props.onChange] Callback function that is called when the header changes
 * @param {string} [props.className] Extra CSS classes on the root element.
 * @param {Object} [props.classes] Override internal class names.
 * @param {string} [props.classes.scrolledIn] Override class for the scrolled-in state
 * (content is hidden).
 * @param {string} [props.classes.scrolledOut] Override class for the scrolled-out state
 * (content is visible).
 * visibility. Contains a boolean indicating whether the header is visible.
 * @param {React.ReactNode} props.children  Content of the header.
 * @param {React.Ref<HTMLDivElement>} ref   Forwarded ref to the header `<div>`.
 * @returns {JSX.Element}
 */
function ScrollHeaderBase({
  className,
  children,
  hideOnScroll = true,
  scrollOffset = 100,
  onlyShowAtTop = false,
  onlyShowAtTopOffset = 0,
  onChange,
  classes: classesProp = {},
}, ref) {
  const { classes, cx } = useStyles();
  const [shouldHideHeader, setShouldHideHeader] = useState(false);

  // The `viewScroll$` stream is shared across all mounted views. Cached routes (e.g. a product
  // list) stay mounted in the background while another route is active, so without this guard the
  // header would react to scroll events emitted by a different, currently visible view and end up
  // hidden when the user navigates back. `visible` is true only for the active route.
  const route = useRoute();
  const visible = route ? route.visible !== false : true;

  useScrollDirectionChange({
    enabled: hideOnScroll && visible,
    offset: scrollOffset,
    onlyFireOnScrollUpAtTop: onlyShowAtTop,
    onlyFireOnScrollUpAtTopOffset: onlyShowAtTopOffset,
    onScrollDown: () => {
      setShouldHideHeader(true);
    },
    onScrollUp: () => {
      setShouldHideHeader(false);
    },
  });

  useEffect(() => {
    if (typeof onChange !== 'function') {
      return;
    }

    onChange(!shouldHideHeader);
  }, [onChange, shouldHideHeader]);

  return (
    <div
      ref={ref}
      className={cx(classes.root, classes.transition, className, {
        [cx(classes.scrolledIn, classesProp?.scrolledIn)]: !shouldHideHeader,
        [cx(classes.scrolledOut, classesProp?.scrolledOut)]: shouldHideHeader,
      })}
    >
      {children}
    </div>
  );
}

/* eslint-enable react/prop-types */

const ScrollHeader = forwardRef(ScrollHeaderBase);
ScrollHeader.displayName = 'ScrollHeader';

ScrollHeader.propTypes = {
  children: PropTypes.node.isRequired,
  classes: PropTypes.shape({
    scrolledIn: PropTypes.string,
    scrolledOut: PropTypes.string,
  }),
  className: PropTypes.string,
  hideOnScroll: PropTypes.bool,
  onChange: PropTypes.func,
  onlyShowAtTop: PropTypes.bool,
  onlyShowAtTopOffset: PropTypes.number,
  scrollOffset: PropTypes.number,
};

ScrollHeader.defaultProps = {
  className: null,
  hideOnScroll: true,
  scrollOffset: 100,
  classes: {},
  onChange: null,
  onlyShowAtTop: false,
  onlyShowAtTopOffset: 0,
};

export default ScrollHeader;
