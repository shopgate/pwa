/**
 * Copyright (c) 2017-present, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import Icon from '@shopgate/pwa-common/components/Icon';

// SVG Content
const content = '<path d="M7.9,18c-1.1,0-2,0.9-2,2s0.9,2,2,2s2-0.9,2-2S9,18,7.9,18z M17.9,18c-1.1,0-2,0.9-2,2s0.9,2,2,2c1.1,0,2-0.9,2-2S19,18,17.9,18z M8.1,14.8l0-0.1L9,13h7.5c0.7,0,1.4-0.4,1.7-1l3.9-7l-1.7-1h0l-1.1,2l-2.8,5h-7l-0.1-0.3L7.1,6L6.1,4L5.2,2H1.9v2h2l3.6,7.6L6.2,14c-0.2,0.3-0.2,0.6-0.2,1c0,1.1,0.9,2,2,2h12v-2H8.3C8.2,15,8.1,14.9,8.1,14.8z"/>';

/**
 * The cart icon component.
 * @param {Object} props The icon component properties.
 * @returns {JSX}
 */
const CartIcon = props => <Icon content={content} {...props} />;

export default CartIcon;
