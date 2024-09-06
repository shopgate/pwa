import React, { Fragment, useMemo } from 'react';
import PropTypes from 'prop-types';
import Helmet from 'react-helmet';
import { embeddedMedia } from '@shopgate/pwa-common/collections';

/**
 * EmbeddedMedia component. Handles loading of media related scripts e.g. the Vimeo Player.
 * @returns {JSX}
 */
const EmbeddedMedia = ({ children, cookieConsentSettings }) => {
  const cookieConsent = useMemo(() => ({
    comfortCookiesAccepted: false,
    statisticsCookiesAccepted: false,
    ...cookieConsentSettings,
  }), [cookieConsentSettings]);

  if (!embeddedMedia.getHasPendingProviders() || !cookieConsent.comfortCookiesAccepted) {
    return children;
  }

  // Get all pending providers
  const pendingProviders = Array.from(embeddedMedia.providers).filter(p => p.isPending);

  /**
   * Inject onLoad cb to script tags
   * @param {Element[]} scriptTags script tags to listen for
   * @param {MediaProvider} provider Provider
   */
  const updateProviderScripts = ({ scriptTags }) => {
    if (scriptTags) {
      scriptTags.forEach((scriptTag) => {
        const provider = pendingProviders.find(p => p.remoteScriptUrl === scriptTag.getAttribute('src'));
        // eslint-disable-next-line no-param-reassign
        scriptTag.onload = () => {
          provider.onScriptLoaded();
        };
      });
    }
  };

  const scripts = pendingProviders.map(provider => ({
    src: provider.remoteScriptUrl,
    type: 'text/javascript',
  }));

  return (
    <Fragment>
      <Helmet
        script={scripts}
        // Helmet doesn't support `onload` in script objects so we have to hack in our own
        onChangeClientState={
          (newState, addedTags) => updateProviderScripts(addedTags)
        }
      />
      {children}
    </Fragment>
  );
};

EmbeddedMedia.propTypes = {
  children: PropTypes.node.isRequired,
  cookieConsentSettings: PropTypes.shape({
    comfortCookiesAccepted: PropTypes.bool,
    statisticsCookiesAccepted: PropTypes.bool,
  }),
};

EmbeddedMedia.defaultProps = {
  cookieConsentSettings: {
    comfortCookiesAccepted: false,
    statisticsCookiesAccepted: false,
  },
};

export default EmbeddedMedia;
