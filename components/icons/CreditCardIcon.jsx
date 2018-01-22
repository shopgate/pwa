/**
 * Copyright (c) 2017-present, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import Icon from '@shopgate/pwa-common/components/Icon';

// SVG Content
const content = '<path d="M0 0h24v24H0z" fill="none"/><path d="M20 4H4c-1.11 0-1.99.89-1.99 2L2 18c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V6c0-1.11-.89-2-2-2zm0 14H4v-6h16v6zm0-10H4V6h16v2z"/>';

/**
 * The credit card icon component.
 * @param {Object} props The icon component properties.
 * @returns {JSX}
 */
const CreditCard = props => <Icon content={content} {...props} />;

export default CreditCard;
