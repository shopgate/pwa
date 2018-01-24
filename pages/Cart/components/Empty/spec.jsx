/**
 * Copyright (c) 2017-present, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import { shallow } from 'enzyme';
import Empty from './index';

// Mock the redux connect() method instead of providing a fake store.
jest.mock('./connector', () => obj => obj);

describe('<CartEmpty />', () => {
  it('should render', () => {
    const wrapper = shallow(<Empty goBackHistory={() => {}} />);

    expect(wrapper).toMatchSnapshot();
  });
});
