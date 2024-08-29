import { connect } from 'react-redux';
import { makeGetPrivacyPolicyLink } from '@shopgate/engage/page/selectors';
import { getIsCookieConsentModalVisible } from '../../selectors/cookieConsent';
import { acceptAllCookies, acceptRequiredCookies, openPrivacySettings } from '../../actions';

/**
 * @return {Object} The extended component props.
 */
const makeGetStateToProps = () => {
  const getPrivacyPolicyLink = makeGetPrivacyPolicyLink();
  return state => ({
    isCookieConsentModalVisible: getIsCookieConsentModalVisible(state),
    privacyPolicyLink: getPrivacyPolicyLink(state),
  });
};

/**
 * Connects the dispatch function to a callable function in the props.
 * @return {Object} The extended component props.
 */
const mapDispatchToProps = {
  acceptAllCookies,
  acceptRequiredCookies,
  openPrivacySettings,
};

export default connect(makeGetStateToProps, mapDispatchToProps);
