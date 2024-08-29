import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { View } from '@shopgate/engage/components';
import { getIsCookieConsentHandled } from '@shopgate/engage/tracking/selectors/cookieConsent';
import { RouteContext } from '@shopgate/pwa-common/context';
import PageContent from './components/Content';

/**
 * Maps the contents of the state to the component props.
 * @param {Object} state The current application state.
 * @return {Object} The extended component props.
 */
const mapStateToProps = state => ({
  /**
   * Pages can be used to the "privacy policy". To prevent that users can break out the cookie
   * consent process, the page needs to be re-configured to remove elements that might open other
   * screens.
   */
  isCookieConsentHandled: getIsCookieConsentHandled(state),
});

/**
 * @param {Object} props The component props.
 * @returns {JSX}
 */
const Page = ({ id, isCookieConsentHandled }) => (
  <View noContentPortal={!isCookieConsentHandled}>
    {id && <PageContent pageId={id} isCookieConsentHandled={isCookieConsentHandled} />}
  </View>
);

Page.propTypes = {
  id: PropTypes.string,
  isCookieConsentHandled: PropTypes.bool,
};

Page.defaultProps = {
  id: null,
  isCookieConsentHandled: true,
};

const ConnectedPage = connect(mapStateToProps)(Page);

export default () => (
  <RouteContext.Consumer>
    {({ params }) => (
      <ConnectedPage id={params.pageId || null} />
    )}
  </RouteContext.Consumer>
);
