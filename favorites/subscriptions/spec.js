/**
 * Copyright (c) 2018, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
import favorites from './index';

describe('Favorites - subscriptions', () => {
  it('should register to streams', () => {
    const mockedSubscribe = jest.fn();
    const mockedDispatch = jest.fn();
    favorites(mockedSubscribe);
    expect(mockedSubscribe.mock.calls.length).toBe(3);
    mockedSubscribe.mock.calls[0][1]({ dispatch: mockedDispatch });
    expect(mockedDispatch.mock.calls.length).toBe(1);
    expect(typeof mockedDispatch.mock.calls[0][0]).toBe('function');
  });
});
