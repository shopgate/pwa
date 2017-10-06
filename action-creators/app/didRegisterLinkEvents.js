/**
 * Copyright (c) 2017, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { DID_REGISTER_LINK_EVENTS } from '../../constants/ActionTypes';

/**
 * Creates the dispatched DID_REGISTER_LINK_EVENTS action object.
 * @returns {Object} The dispatched action object.
 */
const didRegisterLinkEvents = () => ({
  type: DID_REGISTER_LINK_EVENTS,
});

export default didRegisterLinkEvents;
