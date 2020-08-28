import { connect } from 'react-redux';
import { initTracking } from '../action-creators';
import { hasCookieConsent, hasStrictCookieConsent, makeGetPrivacyPolicyLink } from '../selectors';

/**
 * Creates the mapStateToProps connector function.
 * @returns {Function}
 */
const makeMapStateToProps = () => {
  const getPrivacyPolicyLink = makeGetPrivacyPolicyLink();

  return state => ({
    privacyPolicyLink: getPrivacyPolicyLink(state),
    hasCookieConsent: hasCookieConsent(state),
    hasStrictCookieConsent: hasStrictCookieConsent(state),
  });
};

const mapDispatchToProps = {
  initTracking,
};

export default connect(makeMapStateToProps, mapDispatchToProps);
