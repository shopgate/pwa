/**
 * Copyright (c) 2017, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { getWebStorageEntry } from '@shopgate/pwa-core/commands';
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
  subscribe(appDidStart$, async () => {
    await getWebStorageEntry({ name: 'clientInformation' });

    // TODO: instantiate the UnifiedPlugin only if a native tracker is configured (FB, AppsFlyer)
    // eslint-disable-next-line no-new
    new UnifiedPlugin();

    // TODO: loop through all extensions/components with type=tracking an create a instance

    core.registerFinished();
  });
}
