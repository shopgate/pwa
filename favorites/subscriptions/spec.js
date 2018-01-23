/**
 * Copyright (c) 2017 - present, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
import favorites from './index';

jest.mock('../actions/getFavorites', () => withCache => withCache);

describe('Favorites - subscriptions', () => {
  it('should register to streams', () => {
    const mockedSubscribe = jest.fn();
    const mockedDispatch = jest.fn();
    favorites(mockedSubscribe);
    expect(mockedSubscribe.mock.calls.length).toBe(2);
    mockedSubscribe.mock.calls[0][1]({ dispatch: mockedDispatch });
    mockedSubscribe.mock.calls[1][1]({ dispatch: mockedDispatch });
    expect(mockedDispatch.mock.calls.length).toBe(2);
    expect(mockedDispatch.mock.calls[0][0]).toBe(undefined);
    expect(mockedDispatch.mock.calls[1][0]).toBe(true);
  });
});
