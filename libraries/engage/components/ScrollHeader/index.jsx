import React, {
  useState, useContext, useRef, useCallback,
} from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { useScroll } from '@shopgate/engage/core';
import { header, hidden } from './style';
import { ViewContext } from '../View';

/**
 * Scroll Header component
 * @param {Object} props props
 * @returns {JSX}
 */
function ScrollHeader({ className, children }) {
  const ref = useRef();
  const [shouldHideHeader, setShouldHideHeader] = useState(false);
  const { contentRef } = useContext(ViewContext);
  const [offset, setOffset] = useState(0);

  const onScroll = useCallback((callbackData) => {
    const { previousScrollTop, currentScrollTop } = callbackData;
    if (previousScrollTop !== currentScrollTop) {
      const isScrolledDown = previousScrollTop < currentScrollTop;
      const box = ref.current.getBoundingClientRect();
      const stickHeader = currentScrollTop >= offset + 100;
      if (!previousScrollTop) {
        setOffset(currentScrollTop + box.top);
      }
      setShouldHideHeader(isScrolledDown && stickHeader);
    }
  }, [offset]);

  useScroll(onScroll, contentRef?.current);
  return (
    <div
      ref={ref}
      className={classNames(
        header,
        shouldHideHeader && hidden,
        className
      )}
    >
      {children}
    </div>
  );
}

ScrollHeader.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
};

ScrollHeader.defaultProps = {
  className: null,
};

export default ScrollHeader;