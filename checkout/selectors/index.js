/**
 * Copyright (c) 2017, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { getUrl } from '@shopgate/pwa-common/selectors/url';

/**
 * Gets the checkout url.
 * @param {Object} state The application state.
 * @return {string|null}
 */
export const getCheckoutUrl = state => getUrl('checkout', state);
