/**
 * Copyright (c) 2017-present, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import Icon from '@shopgate/pwa-common/components/Icon';

// SVG Content
const content = '<path d="M 13.900391,1.4433594 1.5996094,4.171875 l 0,0.025391 8.5390626,4.2089844 c 4.073387,-0.9018528 8.163817,-1.7958087 12.24414,-2.69141 z m 8.490221,4.8261718 -11.986328,2.6152344 0.111328,13.4472654 11.875,-2.658203 z M 9.9003906,22.25 c -6.600261,1.166667 -3.3001305,0.583333 0,0 z m 0,0 0,-13.4316406 -8.3007812,-4.0957032 0,13.4589848 z M 4.4238281,9.2304688 c 1.01719,0.50398 2.0367375,1.0052022 3.0546875,1.5078122 0.32345,0.12833 0.4898582,0.544909 0.3300782,0.855469 C 6.7949938,11.0955 5.7712662,10.587588 4.7539062,10.085938 4.4304763,9.9572575 4.2659081,9.5411387 4.4238281,9.2304688 Z" />';

/**
 * The box icon component.
 * @param {Object} props The icon component properties.
 * @returns {JSX}
 */
const Box = props => <Icon content={content} {...props} />;

export default Box;
