import { connect } from 'react-redux';
import { getIsCookieConsentModalVisible } from '../../selectors';
import { acceptAllCookies, acceptRequiredCookies, openSettings } from '../../actions';

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
 * @param {Function} dispatch The redux dispatch function.
 * @return {Object} The extended component props.
 */
const mapDispatchToProps = {
  acceptAllCookies,
  acceptRequiredCookies,
  openSettings,
};

export default connect(mapStateToProps, mapDispatchToProps);
