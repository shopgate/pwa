import React, {
  useState, useCallback, useEffect,
} from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { viewScroll$ } from '@shopgate/engage/core/streams';
import {
  root, scrolledIn, scrolledOut, transition,
} from './style';

/**
 * Scroll Header component
 * @param {Object} props props
 * @returns {JSX}
 */
function ScrollHeader({
  className, children, hideOnScroll, scrollOffset,
}) {
  const [shouldHideHeader, setShouldHideHeader] = useState(false);

  const onScroll = useCallback((scrollEvent) => {
    const {
      scrollTop, scrolled, scrollOut, scrollIn,
    } = scrollEvent;

    if (!scrolled) {
      return;
    }

    if (!shouldHideHeader && scrollOut && scrollTop >= scrollOffset) {
      setShouldHideHeader(true);
    }

    if (shouldHideHeader && scrollIn) {
      setShouldHideHeader(false);
    }
  }, [scrollOffset, shouldHideHeader]);

  useEffect(() => {
    if (hideOnScroll) {
      const subscription = viewScroll$.subscribe(onScroll);
      return () => subscription.unsubscribe();
    }
    return undefined;
  });

  return (
    <div className={classNames(root, transition, className, {
      [scrolledIn]: !shouldHideHeader,
      [scrolledOut]: shouldHideHeader,
    })}
    >
      {children}
    </div>
  );
}

ScrollHeader.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
  hideOnScroll: PropTypes.bool,
  scrollOffset: PropTypes.number,
};

ScrollHeader.defaultProps = {
  className: null,
  hideOnScroll: true,
  scrollOffset: 100,
};

export default ScrollHeader;
