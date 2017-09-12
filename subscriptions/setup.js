/**
 * Copyright (c) 2017, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import get from 'lodash/get';

// TODO: how to do this? import extensions from 'Extensions'

import { TYPE_PHONE, OS_ALL } from '@shopgate/pwa-common/constants/Device';
import { getWebStorageEntry } from '@shopgate/pwa-common/commands';
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
  subscribe(appDidStart$, () => {
    getWebStorageEntry({ name: 'clientInformation' }).then((response) => {
      const clientInformation = {
        type: get(response, 'value.device.type', TYPE_PHONE),
        os: get(response, 'value.device.os.platform', OS_ALL),
      };

      // TODO: instantiate the UnifiedPlugin only if a native tracker is configured (FB, AppsFlyer)
      // eslint-disable-next-line no-new
      new UnifiedPlugin();

      // TODO: later we have to loop through all tracking extensions here
      /**
       * Call the init function of the GA plugin.
       * This init function will create the actual instances based on the config
       */
      //GaNativePlugin(clientInformation);

      core.registerFinished();
    });
  });
}
