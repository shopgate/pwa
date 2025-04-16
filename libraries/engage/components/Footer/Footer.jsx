import React, { useRef, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import { UIEvents } from '@shopgate/engage/core/events';
import { getAbsoluteHeight } from '@shopgate/engage/core/helpers';
import { SHEET_EVENTS } from '@shopgate/engage/components';
import {
  footer,
} from './Footer.style';
import {
  handleSafeAreaInsets,
  updateFooterHeight,
} from './helpers';
import { APP_FOOTER_ID, DATA_IGNORED } from './constants';

/**
 * The footer component.
 * @param {Object} props The component props.
 * @returns {JSX.Element}
 */
const Footer = ({ children }) => {
  const footerRef = useRef(null);

  const performFooterUpdate = useCallback(() => {
    handleSafeAreaInsets(footerRef.current);
    updateFooterHeight(getAbsoluteHeight(footerRef.current));
  }, []);

  const handleShow = useCallback(() => {
    updateFooterHeight(getAbsoluteHeight(footerRef.current));
  }, []);

  const handleHide = useCallback(() => {
    updateFooterHeight(0);
  }, []);

  useEffect(() => {
    UIEvents.addListener(SHEET_EVENTS.OPEN, handleHide);
    UIEvents.addListener(SHEET_EVENTS.CLOSE, handleShow);

    return () => {
      UIEvents.removeListener(SHEET_EVENTS.OPEN, handleHide);
      UIEvents.removeListener(SHEET_EVENTS.CLOSE, handleShow);
    };
  }, [handleHide, handleShow]);

  useEffect(() => {
    performFooterUpdate();

    const observer = new MutationObserver((mutations) => {
      const update = mutations
        .filter(mutation => mutation.target.getAttribute(DATA_IGNORED) !== 'true').length > 0;

      if (update) {
        performFooterUpdate();
      }
    });

    observer.observe(footerRef.current, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['style', 'class'],
    });

    return () => {
      observer.disconnect();
    };
  }, [performFooterUpdate]);

  return (
    <div className={`${footer} engage__footer`}>
      <div id={APP_FOOTER_ID} ref={footerRef}>
        {children}
      </div>
    </div>
  );
};

Footer.propTypes = {
  children: PropTypes.node,
};

Footer.defaultProps = {
  children: null,
};

export default Footer;
