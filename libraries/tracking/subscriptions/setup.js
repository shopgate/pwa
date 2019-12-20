import get from 'lodash/get';
import {
  logGroup,
  getWebStorageEntry,
  useBrowserConnector,
  errorManager,
  SOURCE_TRACKING,
  CODE_TRACKING,
  defaultClientInformation,
} from '@shopgate/pwa-core';
import { TYPE_PHONE, OS_ALL, OS_ANDROID } from '@shopgate/pwa-common/constants/Device';
import appConfig, { shopNumber, componentsConfig } from '@shopgate/pwa-common/helpers/config';
import core from '@shopgate/tracking-core/core/Core';
import { appDidStart$ } from '@shopgate/pwa-common/streams/app';
import UnifiedPlugin from '@shopgate/tracking-core/plugins/trackers/Unified';

/**
 * Setup tracking subscriptions.
 * @param {Function} subscribe The subscribe function.
 */
export default function setup(subscribe) {
  /**
   * Gets triggered when the app starts.
   */
  subscribe(appDidStart$, async ({ getState }) => {
    const clientInformationResponse = !useBrowserConnector() ? await getWebStorageEntry({ name: 'clientInformation' }) : { value: defaultClientInformation };

    const clientInformation = {
      type: get(clientInformationResponse, 'value.device.type', TYPE_PHONE),
      os: get(clientInformationResponse, 'value.device.os.platform', OS_ALL),
      state: getState(),
      services: get(clientInformationResponse, 'value.device.supportedAnalyticsServices', []),
      libVersion: get(clientInformationResponse, 'value.libVersion'),
      appVersion: get(clientInformationResponse, 'value.appVersion'),
    };

    // TODO: instantiate the UnifiedPlugin only if a native tracker is configured (FB, AppsFlyer)
    // eslint-disable-next-line no-new
    new UnifiedPlugin();

    if (appConfig.tracking.hasWebTrackingEngage) {
      // eslint-disable-next-line global-require
      const GaBase = require('@shopgate/tracking-core/plugins/trackers/GaBase').default;
      GaBase.createUniversal({
        shopNumber,
        codebaseVersion: get(clientInformationResponse, 'value.codebaseVersion'),
        config: {
          merchant: [],
          shopgate: {
            id: clientInformation.os === OS_ANDROID ?
              appConfig.webTrackingEngage.android :
              appConfig.webTrackingEngage.ios,
            useNetPrices: false,
          },
        },
      });
    }

    try {
      // eslint-disable-next-line global-require, import/no-dynamic-require
      const extensionsIndex = require(`${process.env.THEME_PATH}/extensions/tracking`).default;
      const trackingExtensions = componentsConfig.tracking || {};

      Object.keys(trackingExtensions).forEach((key) => {
        const pluginInit = extensionsIndex[key];

        if (pluginInit) {
          /**
           * Call the init function of the plugin.
           * This init function will create the actual instances
           */
          pluginInit(clientInformation);
        }
      });
    } catch (error) {
      logGroup('Tracking %c: Could not setup plugins', {
        error,
      }, '#ED0422');

      error.code = CODE_TRACKING;
      error.source = SOURCE_TRACKING;
      error.context = 'trackingPlugins';
      errorManager.queue(error);
    }

    core.registerFinished();
  });
}
