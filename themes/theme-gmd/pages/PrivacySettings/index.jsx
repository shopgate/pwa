import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { BackBar } from 'Components/AppBar/presets';
import { View } from '@shopgate/engage/components';
import { PrivacySettings } from '@shopgate/engage/tracking/components';
import { getIsCookieConsentHandled } from '@shopgate/engage/tracking/selectors/cookieConsent';

/**
 * Maps the contents of the state to the component props.
 * @param {Object} state The current application state.
 * @return {Object} The extended component props.
 */
const mapStateToProps = state => ({
  showTitle: getIsCookieConsentHandled(state),
});

/**
 * The CookieConsentPage component.
 * @param {Object} props The component props
 * @param {boolean} props.showTitle Whether to show the page title
 * @returns {JSX.Element}
 */
const PrivacySettingsPage = ({ showTitle }) => (
  <View noContentPortal>
    <BackBar title={showTitle ? 'navigation.privacySettings' : undefined} />
    <PrivacySettings />
  </View>
);

PrivacySettingsPage.propTypes = {
  showTitle: PropTypes.bool,
};

PrivacySettingsPage.defaultProps = {
  showTitle: false,
};

export default connect(mapStateToProps)(PrivacySettingsPage);
