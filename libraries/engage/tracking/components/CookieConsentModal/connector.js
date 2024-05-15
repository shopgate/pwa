import { connect } from 'react-redux';
import { getIsCookieConsentModalVisible } from '../../selectors/cookieConsent';
import { acceptAllCookies, acceptRequiredCookies, openPrivacySettings } from '../../actions';

/**
 * Maps the contents of the state to the component props.
 * @param {Object} state The current application state.
 * @return {Object} The extended component props.
 */
const mapStateToProps = state => ({
  isCookieConsentModalVisible: getIsCookieConsentModalVisible(state),
});

/**
 * Connects the dispatch function to a callable function in the props.
 * @return {Object} The extended component props.
 */
const mapDispatchToProps = {
  acceptAllCookies,
  acceptRequiredCookies,
  openPrivacySettings,
};

export default connect(mapStateToProps, mapDispatchToProps);
