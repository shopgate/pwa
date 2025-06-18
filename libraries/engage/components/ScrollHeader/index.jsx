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
  className,
  children,
  hideOnScroll,
  scrollOffset,
  classes,
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

  const scrolledInStyle = classes?.scrolledIn ? classes.scrolledIn : scrolledIn;
  const scrolledOutStyle = classes?.scrolledOut ? classes.scrolledOut : scrolledOut;
  const transitionStyle = classes?.transition ? classes.transition : transition;
  const rootStyle = classes?.root ? classes.root : root;

  return (
    <div className={classNames(rootStyle, transitionStyle, className, {
      [scrolledInStyle]: !shouldHideHeader,
      [scrolledOutStyle]: shouldHideHeader,
    })}
    >
      {children}
    </div>
  );
}

ScrollHeader.propTypes = {
  children: PropTypes.node.isRequired,
  classes: PropTypes.shape({
    root: PropTypes.string,
    scrolledIn: PropTypes.string,
    scrolledOut: PropTypes.string,
    transition: PropTypes.string,
  }),
  className: PropTypes.string,
  hideOnScroll: PropTypes.bool,
  scrollOffset: PropTypes.number,
};

ScrollHeader.defaultProps = {
  className: null,
  hideOnScroll: true,
  scrollOffset: 100,
  classes: {},
};

export default ScrollHeader;
