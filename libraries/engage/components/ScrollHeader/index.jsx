import React, {
  useState, useContext, useRef, useCallback,
} from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { ViewContext } from '../View';
import { useScroll } from '../../core/hooks/useScroll';
import { header, hidden } from './style';

/**
 * Scroll Header component
 * @param {Object} props props
 * @returns {JSX}
 *
 * @refactor since Engage 6.14.0
 */
function ScrollHeader({ children }) {
  const ref = useRef();
  const [shouldHideHeader, setShouldHideHeader] = useState(false);
  const { contentRef } = useContext(ViewContext);
  const [offset, setOffset] = useState(0);

  const onScroll = useCallback((callbackData) => {
    const {
      previousScrollTop, currentScrollTop, scrolled, scrollOut,
    } = callbackData;
    if (scrolled) {
      const box = ref.current.getBoundingClientRect();
      const stickHeader = currentScrollTop >= offset + 100;
      if (!previousScrollTop) {
        setOffset(currentScrollTop + box.top);
      }
      setShouldHideHeader(scrollOut && stickHeader);
    }
  }, [offset]);

  useScroll(onScroll, contentRef.current);

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
};

export default ScrollHeader;
