import React from 'react';
import CookieConsent from '../providers/CookieConsentProvider.context';

/**
 * Returns the value of the cookie consent provider state.
 * @returns {Object}
 */
export const useCookieConsent = () => React.useContext(CookieConsent);

