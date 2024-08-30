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
  cookieConsentHandled: getIsCookieConsentHandled(state),
});

/**
 * The CookieConsentPage component.
 * @param {Object} props The component props
 * @param {boolean} props.cookieConsentHandled Whether to show the page title
 * @returns {JSX.Element}
 */
const PrivacySettingsPage = ({ cookieConsentHandled }) => (
  <View noContentPortal aria-hidden={false}>
    <BackBar
      {...cookieConsentHandled ? {
        title: 'navigation.privacySettings',
      } : {
        // Hide the search icon when cookie consent is not handled yet
        right: (<></>),
      }}
    />
    <PrivacySettings />
  </View>
);

PrivacySettingsPage.propTypes = {
  cookieConsentHandled: PropTypes.bool,
};

PrivacySettingsPage.defaultProps = {
  cookieConsentHandled: false,
};

export default connect(mapStateToProps)(PrivacySettingsPage);
