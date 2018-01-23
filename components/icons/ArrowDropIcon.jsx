/**
 * Copyright (c) 2017-present, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import Icon from '@shopgate/pwa-common/components/Icon';

// SVG Content
const content = '<path d="M7 10l5 5 5-5z"/>';

/**
 * The arrow-drop icon component.
 * @param {Object} props The icon component properties.
 * @returns {JSX}
 */
const ArrowDrop = props => <Icon content={content} {...props} />;

export default ArrowDrop;
