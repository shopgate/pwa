import React, {
  useState, useRef, useCallback, useEffect,
} from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { viewScroll$ } from '@shopgate/pwa-common/streams/view';
import { header, hidden } from './style';

/**
 * Scroll Header component
 * @param {Object} props props
 * @returns {JSX}
 *
 * @refactor since Engage 6.14.0
 */
function ScrollHeader({ children, hideOnScroll, scrollOffset }) {
  const ref = useRef();
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

  return (
    <div
      ref={ref}
      className={classNames(
        header,
        shouldHideHeader && hidden
      )}
    >
      {children}
    </div>
  );
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
