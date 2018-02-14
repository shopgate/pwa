/**
 * Copyright (c) 2017-present, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import Icon from '@shopgate/pwa-common/components/Icon';

// SVG Content
const content = `
  <rect width="8" height="8" rx="1" transform="translate(3 3)"/>
  <rect width="8" height="8" rx="1" transform="translate(3 13)"/>
  <rect width="8" height="8" rx="1" transform="translate(13 3)"/>
  <rect width="8" height="8" rx="1" transform="translate(13 13)"/>
`;

/**
 * The heart icon component.
 * @param {Object} props The icon component properties.
 * @returns {JSX}
 */
const Grid = props => <Icon content={content} {...props} />;

export default Grid;
