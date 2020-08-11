import React, { useState, useContext } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { useScroll, useBoundingRect } from '@shopgate/engage/core';
import { header, hidden, visible } from './style';
import { ViewContext } from '../View';

/**
 * Scroll Header component
 * @param {Object} props props
 * @returns {JSX}
 */
function ScrollHeader({ className, children }) {
  const [shouldHideHeader, setShouldHideHeader] = useState(false);
  const [shouldShowHeader, setShouldShowHeader] = useState(false);
  const { contentRef } = useContext(ViewContext);
  const [box, ref] = useBoundingRect();

  useScroll((callbackData) => {
    const { previousScrollTop, currentScrollTop } = callbackData;
    if (previousScrollTop !== currentScrollTop) {
      const isScrolledDown = previousScrollTop < currentScrollTop;
      setShouldHideHeader(isScrolledDown && currentScrollTop >= box.top + 50);
      setShouldShowHeader(!isScrolledDown && currentScrollTop >= box.top - 50);
      console.log(currentScrollTop, ref.current.offsetTop, !isScrolledDown, box.top);
    }
  }, contentRef?.current);

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
