import React from 'react';
import PropTypes from 'prop-types';
import CookieConsentProvider from '../../providers/CookieConsentProvider';
import CookieConsentContent from './CookieConsentContent';
import connect from './CookieConsent.connector';

/**
 * The CookieConsent component
 * @returns {JSX}
 */
const CookieConsent = ({ hasCookieConsent }) => {
  if (!hasCookieConsent) {
    return null;
  }

  return (
    <CookieConsentProvider>
      <CookieConsentContent />
    </CookieConsentProvider>
  );
};

CookieConsent.propTypes = {
  hasCookieConsent: PropTypes.bool,
};

CookieConsent.defaultProps = {
  hasCookieConsent: false,
};

export default connect(CookieConsent);
