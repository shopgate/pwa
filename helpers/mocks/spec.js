/**
 * Copyright (c) 2017, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import mockRenderOptions from './mockRenderOptions';

describe('MockRenderOptions', () => {
  it('should return object', () => {
    expect(typeof mockRenderOptions).toBe('object');
    expect(typeof mockRenderOptions.context.i18n).toBe('function');
    const i18n = mockRenderOptions.context.i18n();
    /* eslint-disable no-underscore-dangle */
    expect(i18n.__('foo')).toBe('foo');
    expect(i18n.__()).toBe('');
    expect(i18n._p()).toBe('p');
    expect(i18n._d()).toBe('d');
    /* eslint-enable no-underscore-dangle */
  });
});
