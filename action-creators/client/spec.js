/**
 * Copyright (c) 2018, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {
  requestClientInformation,
  receiveClientInformation,
  errorClientInformation,
} from './index';

import {
  REQUEST_CLIENT_INFORMATION,
  RECEIVE_CLIENT_INFORMATION,
  ERROR_CLIENT_INFORMATION,
} from '../../constants/ActionTypes';

describe('ActionCreators: client', () => {
  it('should create an action to request client information', () => {
    const expectedAction = {
      type: REQUEST_CLIENT_INFORMATION,
    };

    expect(requestClientInformation()).toEqual(expectedAction);
  });

  it('should create an action when receive client information', () => {
    const data = {
      some: 'data',
    };
    const expectedAction = {
      type: RECEIVE_CLIENT_INFORMATION,
      data,
    };

    expect(receiveClientInformation(data)).toEqual(expectedAction);
  });

  it('should create an action when requesting failed', () => {
    const expectedAction = {
      type: ERROR_CLIENT_INFORMATION,
    };

    expect(errorClientInformation()).toEqual(expectedAction);
  });
});
