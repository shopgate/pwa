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
  describe('Favorites - enabled', () => {
    beforeAll(() => {
      global.process.env.APP_CONFIG = {
        hasFavorites: true,
      };
    });
    afterAll(() => {
      delete global.process.env.APP_CONFIG;
    });
    it('should register to streams', () => {
      const mockedSubscribe = jest.fn();
      const mockedDispatch = jest.fn();
      favorites(mockedSubscribe);
      expect(mockedSubscribe.mock.calls.length).toBe(3);
      mockedSubscribe.mock.calls[0][1]({ dispatch: mockedDispatch });
      mockedSubscribe.mock.calls[1][1]({ dispatch: mockedDispatch });
      mockedSubscribe.mock.calls[2][1]({ dispatch: mockedDispatch });
      expect(mockedDispatch.mock.calls.length).toBe(3);
      expect(mockedDispatch.mock.calls[0][0]).toBe(undefined);
      expect(mockedDispatch.mock.calls[1][0]).toBe(true);
      expect(mockedDispatch.mock.calls[2][0]).toBe(true);
    });
  });
  describe('Favorites disabled', () => {
    beforeAll(() => {
      global.process.env.APP_CONFIG = {
        hasFavorites: false,
      };
    });
    afterAll(() => {
      delete global.process.env.APP_CONFIG;
    });
    it('should do nothing and return false', () => {
      const mockedSubscribe = jest.fn();
      favorites(mockedSubscribe);
      expect(mockedSubscribe.mock.calls.length).toBe(0);
    });
  });
});
