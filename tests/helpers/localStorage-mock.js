/*
 * Copyright (c) 2017, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * Provide a localstorage mock
 * @returns {*}
 */
const storageMock = () => {
  const storage = {};

  return {
    setItem(key, value) {
      storage[key] = value;
    },

    getItem(key) {
      return key in storage ? storage[key] : null;
    },

    removeItem(key) {
      delete storage[key];
    },

    get length() {
      return Object.keys(storage).length;
    },

    key(i) {
      const keys = Object.keys(storage);
      return keys[i] || null;
    },
  };
};

export default storageMock;
