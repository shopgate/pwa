import get from 'lodash/get';
import event from '@shopgate/pwa-core/classes/Event';
import logGroup from '@shopgate/pwa-core/helpers/logGroup';
import { getWebStorageEntry } from '@shopgate/pwa-core/commands/webStorage';
import { useBrowserConnector } from '@shopgate/pwa-core/helpers';
import errorManager from '@shopgate/pwa-core/classes/ErrorManager';
import { SOURCE_TRACKING, CODE_TRACKING } from '@shopgate/pwa-core/constants/ErrorManager';
import { defaultClientInformation } from '@shopgate/pwa-core/helpers/version';
import registerEvents from '@shopgate/pwa-core/commands/registerEvents';
import { TYPE_PHONE, OS_ALL } from '@shopgate/pwa-common/constants/Device';
import { componentsConfig } from '@shopgate/pwa-common/helpers/config';
import core from '@shopgate/tracking-core/core/Core';
import {
  appWillStart$,
  appDidStart$,
} from '@shopgate/pwa-common/streams/app';
import UnifiedPlugin from '@shopgate/tracking-core/plugins/trackers/Unified';
import { APP_EVENT_VIEW_DID_APPEAR, APP_EVENT_VIEW_DID_DISAPPEAR } from '../constants';
import {
  pwaDidAppear,
  pwaDidDisappear,
} from '../action-creators';

/**
 * Setup tracking subscriptions.
 * @param {Function} subscribe The subscribe function.
 */
export default function setup(subscribe) {
  subscribe(appWillStart$, ({ dispatch }) => {
    registerEvents([
      APP_EVENT_VIEW_DID_APPEAR,
      APP_EVENT_VIEW_DID_DISAPPEAR,
    ]);

    event.addCallback(APP_EVENT_VIEW_DID_APPEAR, () => {
      dispatch(pwaDidAppear());
    });

    event.addCallback(APP_EVENT_VIEW_DID_DISAPPEAR, () => {
      dispatch(pwaDidDisappear());
    });
  });

  /**
   * Gets triggered when the app starts.
   */
  subscribe(appDidStart$, async ({ getState }) => {
    const clientInformationResponse = !useBrowserConnector() ? await getWebStorageEntry({ name: 'clientInformation' }) : { value: defaultClientInformation };

    const clientInformation = {
      type: get(clientInformationResponse, 'value.device.type', TYPE_PHONE),
      os: get(clientInformationResponse, 'value.device.os.platform', OS_ALL),
      state: getState(),
    };

    // TODO: instantiate the UnifiedPlugin only if a native tracker is configured (FB, AppsFlyer)
    // eslint-disable-next-line no-new
    new UnifiedPlugin();

    try {
      // eslint-disable-next-line no-undef, global-require, import/no-dynamic-require
      const extensionsIndex = require(`${__THEME_PATH__}/extensions/tracking`).default;
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
