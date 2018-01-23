/**
 * Copyright (c) 2017-present, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {
  CREATE_MODAL,
  REMOVE_MODAL,
} from '../../constants/ActionTypes';

import {
  createModal,
  removeModal,
} from './index';

const options = { some: 'data' };
const id = 'modalId';

describe('Action Creators: modal', () => {
  describe('createModal()', () => {
    it('should work as expected', () => {
      const expected = {
        type: CREATE_MODAL,
        options,
      };
      expect(createModal(options)).toEqual(expected);
    });
  });

  describe('removeModal()', () => {
    it('should work as expected', () => {
      const expected = {
        type: REMOVE_MODAL,
        id,
      };
      expect(removeModal(id)).toEqual(expected);
    });
  });
});
