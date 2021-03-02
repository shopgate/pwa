import React, { useState, useCallback, useEffect } from 'react';
import PropTypes from 'prop-types';
import { viewScroll$ } from '@shopgate/pwa-common/streams/view';
import { scrolledIn, scrolledOut } from './style';

/**
 * Scroll Header component
 * @param {Object} props props
 * @returns {JSX}
 *
 */
function ScrollHeader({ children, hideOnScroll, scrollOffset }) {
  const [shouldHideHeader, setShouldHideHeader] = useState(false);

  const onScroll = useCallback((scrollEvent) => {
    const {
      scrollTop, scrolled, scrollOut, scrollIn,
    } = scrollEvent;
    if (scrolled) {
      if (!shouldHideHeader && scrollOut && scrollTop >= scrollOffset) {
        setShouldHideHeader(true);
      }
      if (shouldHideHeader && scrollIn) {
        setShouldHideHeader(false);
      }
    }
  }, [scrollOffset, shouldHideHeader]);

  useEffect(() => {
    if (hideOnScroll) {
      const subscription = viewScroll$.subscribe(onScroll);
      return () => subscription.unsubscribe();
    }
    return undefined;
  });

  const className = shouldHideHeader ? scrolledOut : scrolledIn;

  return React.cloneElement(children, {
    ...children.props,
    className: `${children.props.className.toString()} ${className}`,
  });
}

ScrollHeader.propTypes = {
  children: PropTypes.node.isRequired,
  hideOnScroll: PropTypes.bool,
  scrollOffset: PropTypes.number,
};

ScrollHeader.defaultProps = {
  hideOnScroll: true,
  scrollOffset: 100,
};

export default ScrollHeader;
