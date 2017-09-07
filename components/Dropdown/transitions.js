/**
 * Copyright (c) 2017, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

export default {
  open: {
    set: { height: 'auto' },
    from: { height: 0 },
  },
  initialOpen: {
    set: { height: 'auto' },
    from: { height: 'auto' },
  },
  close: {
    from: { height: 'auto' },
    to: { height: 0 },
  },
  initialClose: {
    from: { height: 0 },
    to: { height: 0 },
  },
};
