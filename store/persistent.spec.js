/**
 * Copyright (c) 2017, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { initPersistentStorage, persist } from './persistent';

const localStorageMock = global.window.localStorage;

describe('Persistent State storage', () => {
  const fooReducer = persist('foo', () => ({ foo: 1 }), 'v1');
  const barReducer = persist('bar', () => ({ bar: 2 }), 'v2');

  it('should create empty state when nothing was saved', () => {
    localStorageMock.clear();
    expect(initPersistentStorage()).toEqual({});
  });

  it('should persist when all versions are valid', () => {
    localStorageMock.clear();
    localStorageMock.setItem('shopgateState', JSON.stringify({
      foo: {
        version: 'v1',
        state: { foo: 1 },
      },
      bar: {
        version: 'v2',
        state: { bar: 2 },
      },
    }));
    expect(initPersistentStorage()).toEqual({
      foo: { foo: 1 },
      bar: { bar: 2 },
    });
  });

  it('should not persist when version is invalid', () => {
    localStorageMock.clear();
    localStorageMock.setItem('shopgateState', JSON.stringify({
      foo: {
        version: 'v1',
        state: { foo: 1 },
      },
      bar: {
        version: 'v1',
        state: { bar: 1 },
      },
    }));
    expect(initPersistentStorage()).toEqual({
      foo: { foo: 1 },
    });
  });

  it('should update storage after reducer has been called', (done) => {
    localStorageMock.clear();
    localStorageMock.setItem('shopgateState', JSON.stringify({
      foo: {
        version: 'v1',
        state: { foo: 1 },
      },
      bar: {
        version: 'v1',
        state: { bar: 1 },
      },
    }));
    initPersistentStorage();

    fooReducer();
    barReducer();

    setTimeout(() => {
      expect(JSON.parse(localStorageMock.getItem('shopgateState'))).toEqual({
        foo: {
          version: 'v1',
          state: { foo: 1 },
        },
        bar: {
          version: 'v2',
          state: { bar: 2 },
        },
      });
      done();
    }, 2000);
  });
});
