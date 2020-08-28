import React, {
  useMemo, useCallback, useState, useLayoutEffect,
} from 'react';
import PropTypes from 'prop-types';
import { useCookies } from 'react-cookie';
import { i18n } from '@shopgate/engage/core';
import {
  COOKIE_CONSENT_COOKIE_NAME_STATUS,
  COOKIE_CONSENT_COOKIE_NAME_PREFS,
  COOKIE_CONSENT_STATUS_ALLOW,
  COOKIE_CONSENT_STATUS_DENY,
  COOKIE_CONSENT_PREF_NEEDED,
  COOKIE_CONSENT_PREF_ANALYTICS,
} from '../constants';
import Context from './CookieConsentProvider.context';
import connect from './CookieConsentProvider.connector';

/**
 * @returns {JSX}
 */
const CookieConsentProvider = ({
  privacyPolicyLink,
  hasCookieConsent,
  hasStrictCookieConsent,
  initTracking,
  children,
}) => {
  const [cookies, setCookie] = useCookies([
    COOKIE_CONSENT_COOKIE_NAME_STATUS,
    COOKIE_CONSENT_COOKIE_NAME_PREFS,
  ]);

  const [isVisible, setIsVisible] = useState(
    hasCookieConsent && ![COOKIE_CONSENT_STATUS_ALLOW, COOKIE_CONSENT_STATUS_DENY]
      .includes(cookies[COOKIE_CONSENT_COOKIE_NAME_STATUS])
  );
  const [allowAnalytics, setAllowAnalytics] = useState(false);
  const [fadeOutDelay, setFadeOutDelay] = useState(0);

  useLayoutEffect(() => {
    const { [COOKIE_CONSENT_COOKIE_NAME_STATUS]: status } = cookies;
    if ([COOKIE_CONSENT_STATUS_ALLOW, COOKIE_CONSENT_STATUS_DENY].includes(status)) {
      setTimeout(() => {
        setIsVisible(false);
      }, fadeOutDelay);
    }
  }, [cookies, fadeOutDelay]);

  const saveCookies = useCallback((allowed = true, analyticsAllowed = false) => {
    const status = allowed ? COOKIE_CONSENT_STATUS_ALLOW : COOKIE_CONSENT_STATUS_DENY;
    const prefs = [
      COOKIE_CONSENT_PREF_NEEDED,
      ...(analyticsAllowed ? [COOKIE_CONSENT_PREF_ANALYTICS] : []),
    ];

    const expires = new Date();
    expires.setFullYear(expires.getFullYear() + 1);

    setCookie(COOKIE_CONSENT_COOKIE_NAME_STATUS, status, { expires });
    setCookie(COOKIE_CONSENT_COOKIE_NAME_PREFS, prefs, { expires });

    if (analyticsAllowed) {
      // Initialize the tracking if allowed
      initTracking();
    }
  }, [initTracking, setCookie]);

  const onClickPrimary = useCallback(() => {
    if (hasStrictCookieConsent) {
      // In strict mode the button saves the current configuration
      saveCookies(true, allowAnalytics);
      return;
    }

    // In normal mode analytics are accepted
    setAllowAnalytics(true);
    // Removal of the banner needs to be postponed, so that the user can see the added checkmark
    setFadeOutDelay(1000);
    saveCookies(true, true);
  }, [allowAnalytics, hasStrictCookieConsent, saveCookies]);

  const onClickSecondary = useCallback(() => {
    const strict = hasStrictCookieConsent;
    // In strict mode the button denies cookies
    saveCookies(!strict, strict ? false : allowAnalytics);
  }, [allowAnalytics, hasStrictCookieConsent, saveCookies]);

  const onClickAllowAnalytics = useCallback(() => {
    setAllowAnalytics(!allowAnalytics);
  }, [allowAnalytics]);

  const buttonLabels = useMemo(() => {
    if (hasStrictCookieConsent) {
      return {
        secondary: i18n.text('tracking.cookieConsent.decline'),
        primary: i18n.text('tracking.cookieConsent.save'),
      };
    }

    return {
      secondary: i18n.text('tracking.cookieConsent.allowSelected'),
      primary: i18n.text('tracking.cookieConsent.allowAll'),
    };
  }, [hasStrictCookieConsent]);

  const value = useMemo(() => ({
    isVisible,
    allowAnalytics,
    privacyPolicyLink,
    buttonLabels,
    onClickPrimary,
    onClickSecondary,
    onClickAllowAnalytics,
  }), [
    isVisible,
    allowAnalytics,
    privacyPolicyLink,
    buttonLabels,
    onClickPrimary,
    onClickSecondary,
    onClickAllowAnalytics,
  ]);

  return (
    <Context.Provider value={value}>
      {children}
    </Context.Provider>
  );
};

CookieConsentProvider.propTypes = {
  initTracking: PropTypes.func.isRequired,
  children: PropTypes.node,
  hasCookieConsent: PropTypes.bool,
  hasStrictCookieConsent: PropTypes.bool,
  privacyPolicyLink: PropTypes.string,
};

CookieConsentProvider.defaultProps = {
  children: null,
  privacyPolicyLink: null,
  hasCookieConsent: false,
  hasStrictCookieConsent: false,
};

export default connect(CookieConsentProvider);
