/**
 * Copyright (c) 2017, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import * as actions from './index';
import * as types from '../../constants/ActionTypes';

describe('ActionCreators: client', () => {
  it('should create an action to request client information', () => {
    const expectedAction = {
      type: types.REQUEST_CLIENT_INFORMATION,
    };

    expect(actions.requestClientInformation()).toEqual(expectedAction);
  });

  it('should create an action when receive client information', () => {
    const data = {
      some: 'data',
    };
    const expectedAction = {
      type: types.RECEIVE_CLIENT_INFORMATION,
      data,
    };

    expect(actions.receiveClientInformation(data)).toEqual(expectedAction);
  });

  it('should create an action when requesting failed', () => {
    const expectedAction = {
      type: types.ERROR_CLIENT_INFORMATION,
    };

    expect(actions.errorClientInformation()).toEqual(expectedAction);
  });
});
