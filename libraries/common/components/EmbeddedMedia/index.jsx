import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import Helmet from 'react-helmet';
import { embeddedMedia } from '@shopgate/pwa-common/collections';

/**
 * EmbeddedMedia component.
 * @returns {JSX}
 */
const EmbeddedMedia = ({ children }) => {
  if (!embeddedMedia.hasNotReady()) {
    return children;
  }

  const providers = [...embeddedMedia.providers].filter(p => !p.sdkReady);

  /**
   * Inject onLoad cb to script tag
   * @param {Element[]} scriptTags script tags
   * @param {MediaProvider} provider provider
   */
  const handleProviderScript = ({ scriptTags }) => {
    if (scriptTags) {
      scriptTags.forEach((scriptTag) => {
        const provider = providers.find(p => p.sdkUrl === scriptTag.getAttribute('src'));
        // eslint-disable-next-line no-param-reassign
        scriptTag.onload = () => {
          provider.onSdkLoaded();
        };
      });
    }
  };

  const scripts = providers.map(provider => ({
    src: provider.sdkUrl,
    type: 'text/javascript',
  }));

  return (
    <Fragment>
      <Helmet
        script={scripts}
        // Helmet doesn't support `onload` in script objects so we have to hack in our own
        onChangeClientState={
          (newState, addedTags) => handleProviderScript(addedTags)
        }
      />
      {children}
    </Fragment>
  );
};

EmbeddedMedia.propTypes = {
  children: PropTypes.node.isRequired,
};

export default EmbeddedMedia;
