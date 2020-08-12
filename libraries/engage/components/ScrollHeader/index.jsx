import React, {
  useState, useContext, useRef, useCallback,
} from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { useScroll } from '@shopgate/engage/core';
import { header, hidden, visible } from './style';
import { ViewContext } from '../View';

/**
 * Scroll Header component
 * @param {Object} props props
 * @returns {JSX}
 */
function ScrollHeader({ className, children }) {
  const ref = useRef();
  const [shouldHideHeader, setShouldHideHeader] = useState(false);
  const [shouldShowHeader, setShouldShowHeader] = useState(false);
  const { contentRef } = useContext(ViewContext);

  const onScroll = useCallback((callbackData) => {
    const { previousScrollTop, currentScrollTop } = callbackData;
    if (previousScrollTop !== currentScrollTop) {
      const isScrolledDown = previousScrollTop < currentScrollTop;
      const box = ref.current.getBoundingClientRect();
      setShouldHideHeader(isScrolledDown && box.top <= -box.height);
      setShouldShowHeader(!isScrolledDown);
    }
  }, []);

  useScroll(onScroll, contentRef?.current);

  return (
    <div
      ref={ref}
      className={classNames(
        header,
        shouldHideHeader && hidden,
        shouldShowHeader && visible,
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
