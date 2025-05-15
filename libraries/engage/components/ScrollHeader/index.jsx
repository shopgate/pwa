import React, { useState } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { useScrollDirectionChange } from '@shopgate/engage/core/hooks';
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

  useScrollDirectionChange({
    enabled: hideOnScroll,
    offset: scrollOffset,
    onScrollDown: () => {
      setShouldHideHeader(true);
    },
    onScrollUp: () => {
      setShouldHideHeader(false);
    },
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
